import { useEffect, useRef, memo } from "react";

/**
 * ARScene
 *
 * Injects the <a-scene> into the DOM and handles marker events.
 * It's memoised so it doesn't re-render and reset the camera when React state changes.
 */
const ARScene = memo(({ onMarkerDetected, onMarkerLost }) => {
  const containerRef = useRef(null);
  const previewVideoRef = useRef(null);
  const previewHintRef = useRef(null);
  const onFoundRef = useRef(onMarkerDetected);
  const onLostRef = useRef(onMarkerLost);

  // Keep refs up to date with the latest props
  useEffect(() => {
    onFoundRef.current = onMarkerDetected;
    onLostRef.current = onMarkerLost;
  }, [onMarkerDetected, onMarkerLost]);

  useEffect(() => {
    // We only want to inject this once
    if (!containerRef.current || containerRef.current.hasChildNodes()) return;

    const bigSnakeModelUrl = new URL(
      "../../model/anaconda.glb",
      import.meta.url,
    ).href;

    const createSceneNode = (tagName, attributes = {}) => {
      const node = document.createElement(tagName);

      Object.entries(attributes).forEach(([name, value]) => {
        node.setAttribute(name, value);
      });

      return node;
    };

    const createCenteredGltfModel = ({
      modelUrl,
      targetSize = 0.9,
      position = "0 0 0",
      rotation = "-90 90 0",
      bobToY = 0.06,
      turnToY = 8,
      startHidden = false,
      onModelLoaded,
      onModelError,
    }) => {
      const anchorEl = createSceneNode("a-entity", {
        position,
        rotation,
        visible: startHidden ? "false" : "true",
        animation__bob: `property: position; dir: alternate; dur: 1500; easing: easeInOutSine; loop: true; to: 0 ${bobToY} 0`,
        animation__turn: `property: rotation; dir: alternate; dur: 1300; easing: easeInOutSine; loop: true; to: -90 ${turnToY} 0`,
      });

      const modelEl = createSceneNode("a-entity", {
        "gltf-model": `url(${modelUrl})`,
      });

      modelEl.addEventListener("model-loaded", () => {
        const Three = window.THREE;
        const mesh = modelEl.getObject3D("mesh");

        if (!Three || !mesh) {
          return;
        }

        mesh.updateMatrixWorld(true);

        const bounds = new Three.Box3().setFromObject(mesh);
        const center = bounds.getCenter(new Three.Vector3());
        const size = bounds.getSize(new Three.Vector3());
        const longestSide = Math.max(size.x, size.y, size.z);

        // Recenter mesh to avoid exporter pivot offsets (tail-only view).
        mesh.position.x -= center.x;
        mesh.position.y -= center.y;
        mesh.position.z -= center.z;

        if (longestSide > 0) {
          const uniformScale = targetSize / longestSide;
          modelEl.object3D.scale.set(uniformScale, uniformScale, uniformScale);
        }

        if (startHidden) {
          anchorEl.setAttribute("visible", "true");
        }

        if (onModelLoaded) {
          onModelLoaded();
        }
      });

      modelEl.addEventListener("model-error", () => {
        if (onModelError) {
          onModelError();
        }
      });

      anchorEl.appendChild(modelEl);
      return { anchorEl, modelEl };
    };

    const createSnakeModel = ({
      scale,
      bodyColor,
      bellyColor,
      accentColor,
      segmentCount,
      bobHeight,
      rotationSpeed,
      hasHood = false,
      hoodColor,
    }) => {
      const snakeRoot = createSceneNode("a-entity", {
        position: "0 0.2 0",
        rotation: "-90 0 0",
        scale,
        animation__bob: `property: position; dir: alternate; dur: 1200; easing: easeInOutSine; loop: true; to: 0 ${
          0.2 + bobHeight
        } 0`,
        animation__turn: `property: rotation; dir: alternate; dur: ${rotationSpeed}; easing: easeInOutSine; loop: true; to: -90 12 0`,
      });

      for (let index = 0; index < segmentCount; index += 1) {
        const x = -0.38 + index * 0.12;
        const y = Math.sin(index * 0.85) * 0.08;
        const radius = 0.12 - index * 0.006;

        const segment = createSceneNode("a-sphere", {
          position: `${x.toFixed(3)} ${y.toFixed(3)} 0`,
          radius: radius.toFixed(3),
          color: bodyColor,
          segmentsWidth: "16",
          segmentsHeight: "12",
          material: "metalness: 0.08; roughness: 0.7;",
        });

        snakeRoot.appendChild(segment);

        if (index < segmentCount - 1) {
          const belly = createSceneNode("a-sphere", {
            position: `${x.toFixed(3)} ${(y - 0.03).toFixed(3)} 0.02`,
            radius: (radius * 0.72).toFixed(3),
            color: bellyColor,
            segmentsWidth: "12",
            segmentsHeight: "10",
            material: "metalness: 0.02; roughness: 0.9;",
          });
          snakeRoot.appendChild(belly);
        }
      }

      const head = createSceneNode("a-sphere", {
        position: "0.45 0.03 0",
        radius: "0.15",
        color: bodyColor,
        segmentsWidth: "18",
        segmentsHeight: "14",
        material: "metalness: 0.08; roughness: 0.65;",
      });

      const jaw = createSceneNode("a-sphere", {
        position: "0.5 -0.03 0.02",
        radius: "0.11",
        color: bellyColor,
        segmentsWidth: "12",
        segmentsHeight: "10",
        material: "metalness: 0.02; roughness: 0.92;",
      });

      const leftEye = createSceneNode("a-sphere", {
        position: "0.51 0.09 0.08",
        radius: "0.025",
        color: "#111111",
      });

      const rightEye = createSceneNode("a-sphere", {
        position: "0.51 0.09 -0.08",
        radius: "0.025",
        color: "#111111",
      });

      const tongue = createSceneNode("a-cone", {
        position: "0.64 0.0 0",
        rotation: "0 0 -90",
        radiusBottom: "0.012",
        radiusTop: "0.001",
        height: "0.18",
        color: accentColor,
        material: "metalness: 0.02; roughness: 0.8;",
        animation__flick:
          "property: scale; dir: alternate; dur: 240; easing: easeInOutSine; loop: true; to: 1 1.18 1",
      });

      head.appendChild(leftEye);
      head.appendChild(rightEye);
      head.appendChild(tongue);

      if (hasHood) {
        const hoodLeft = createSceneNode("a-sphere", {
          position: "0.43 0.06 0.14",
          radius: "0.13",
          scale: "1.2 0.8 0.4",
          color: hoodColor || bodyColor,
          material: "metalness: 0.08; roughness: 0.68;",
        });

        const hoodRight = createSceneNode("a-sphere", {
          position: "0.43 0.06 -0.14",
          radius: "0.13",
          scale: "1.2 0.8 0.4",
          color: hoodColor || bodyColor,
          material: "metalness: 0.08; roughness: 0.68;",
        });

        snakeRoot.appendChild(hoodLeft);
        snakeRoot.appendChild(hoodRight);
      }

      snakeRoot.appendChild(jaw);
      snakeRoot.appendChild(head);

      return snakeRoot;
    };

    // 1. Create the a-scene element
    const sceneEl = document.createElement("a-scene");

    // embedded: necessary to position it with CSS within our app
    // arjs: configuration for AR.js
    //   sourceType: webcam (default)
    //   debugUIEnabled: false
    //   detectionMode: mono_and_matrix
    //   matrixCodeType: 3x3_HAMMING_63 (for our barcode markers 0, 1, 2)
    sceneEl.setAttribute("embedded", "");
    sceneEl.setAttribute(
      "arjs",
      "sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3_HAMMING63;",
    );
    sceneEl.setAttribute("renderer", "alpha: true; antialias: true;");
    sceneEl.style.position = "absolute";
    sceneEl.style.inset = "0";
    sceneEl.style.width = "100%";
    sceneEl.style.height = "100%";
    sceneEl.style.background = "transparent";

    sceneEl.addEventListener("loaded", () => {
      const renderer = sceneEl.renderer;
      if (renderer && renderer.setClearColor) {
        renderer.setClearColor(0x000000, 0);
      }
    });

    // Add VR button removal
    sceneEl.setAttribute("vr-mode-ui", "enabled: false");

    // ── Pre-configured Markers ──
    const markers = [
      // Snakes & Ladders symbols: barcodes 0-4
      { type: "barcode", value: 0, eventData: { kind: "barcode", value: 0 } },
      { type: "barcode", value: 1, eventData: { kind: "barcode", value: 1 } },
      { type: "barcode", value: 2, eventData: { kind: "barcode", value: 2 } },
      { type: "barcode", value: 3, eventData: { kind: "barcode", value: 3 } },
      { type: "barcode", value: 4, eventData: { kind: "barcode", value: 4 } },
    ];

    markers.forEach((mcfg) => {
      const markerEl = document.createElement("a-marker");

      if (mcfg.type === "pattern") {
        markerEl.setAttribute("preset", mcfg.preset);
      } else if (mcfg.type === "barcode") {
        markerEl.setAttribute("type", "barcode");
        markerEl.setAttribute("value", mcfg.value);
      }

      // We use the Ref inside the listener so it's never stale
      markerEl.addEventListener("markerFound", () => {
        if (onFoundRef.current) {
          onFoundRef.current(mcfg.eventData.value);
        }
      });

      markerEl.addEventListener("markerLost", () => {
        if (onLostRef.current) {
          onLostRef.current(mcfg.eventData.value);
        }
      });

      // Visual indicator that tracking is active on this marker
      const boxEl = document.createElement("a-box");
      boxEl.setAttribute("position", "0 0.5 0");
      boxEl.setAttribute("scale", "0.5 0.5 0.5");
      boxEl.setAttribute(
        "material",
        "color: #00f5a0; opacity: 0.3; transparent: true;",
      );
      markerEl.appendChild(boxEl);

      if (mcfg.value === 2) {
        const fallbackSmallSnake = createSnakeModel({
          scale: "0.6 0.6 0.6",
          bodyColor: "#4f7d39",
          bellyColor: "#c6d88d",
          accentColor: "#e87979",
          segmentCount: 6,
          bobHeight: 0.06,
          rotationSpeed: 1800,
        });

        markerEl.appendChild(fallbackSmallSnake);

        const centeredSmallModel = createCenteredGltfModel({
          modelUrl: bigSnakeModelUrl,
          targetSize: 0.36,
          position: "0 0 0",
          rotation: "-90 90 0",
          bobToY: 0.04,
          turnToY: 8,
          startHidden: true,
          onModelLoaded: () => {
            fallbackSmallSnake.setAttribute("visible", "false");
          },
          onModelError: () => {
            fallbackSmallSnake.setAttribute("visible", "true");
          },
        });

        markerEl.appendChild(centeredSmallModel.anchorEl);
      }

      if (mcfg.value === 3) {
        const fallbackSnake = createSnakeModel({
          scale: "0.9 0.9 0.9",
          bodyColor: "#4b5563",
          bellyColor: "#d1d5db",
          accentColor: "#dc2626",
          segmentCount: 9,
          bobHeight: 0.08,
          rotationSpeed: 1400,
          hasHood: true,
          hoodColor: "#6b7280",
        });

        markerEl.appendChild(fallbackSnake);

        const centeredModel = createCenteredGltfModel({
          modelUrl: bigSnakeModelUrl,
          targetSize: 0.58,
          position: "0 0 0",
          rotation: "-90 90 0",
          bobToY: 0.05,
          turnToY: 8,
          startHidden: true,
          onModelLoaded: () => {
            fallbackSnake.setAttribute("visible", "false");
          },
          onModelError: () => {
            fallbackSnake.setAttribute("visible", "true");
          },
        });

        markerEl.appendChild(centeredModel.anchorEl);
      }

      if (mcfg.value === 4) {
        markerEl.appendChild(
          createSnakeModel({
            scale: "1.25 1.25 1.25",
            bodyColor: "#3f3f46",
            bellyColor: "#d4d4d8",
            accentColor: "#dc2626",
            segmentCount: 10,
            bobHeight: 0.14,
            rotationSpeed: 1200,
            hasHood: true,
            hoodColor: "#52525b",
          }),
        );
      }

      sceneEl.appendChild(markerEl);
    });

    // ── Camera ──
    const cameraEl = document.createElement("a-entity");
    cameraEl.setAttribute("camera", "");
    sceneEl.appendChild(cameraEl);

    // Create a dedicated in-frame preview video.
    // We do not move AR.js' internal video node to avoid iOS rendering issues.
    const previewVideo = document.createElement("video");
    previewVideo.className = "ar-live-preview";
    previewVideo.setAttribute("autoplay", "true");
    previewVideo.setAttribute("playsinline", "true");
    previewVideo.setAttribute("muted", "true");
    previewVideo.muted = true;
    previewVideoRef.current = previewVideo;

    const previewHint = document.createElement("div");
    previewHint.className = "ar-preview-hint";
    previewHint.textContent = "Starting camera...";
    previewHintRef.current = previewHint;

    // Inject into frame: preview video first, then AR scene overlay.
    containerRef.current.appendChild(previewVideo);
    containerRef.current.appendChild(sceneEl);
    containerRef.current.appendChild(previewHint);

    const attachMirrorPreview = async () => {
      const videoCandidates = [
        ...document.querySelectorAll("video.arjs-video"),
        ...document.querySelectorAll("video"),
      ];

      const sourceVideo = videoCandidates.find(
        (v) => v !== previewVideo && v.srcObject,
      );

      if (!sourceVideo || !sourceVideo.srcObject) {
        return;
      }

      if (previewVideo.srcObject !== sourceVideo.srcObject) {
        previewVideo.srcObject = sourceVideo.srcObject;
      }

      try {
        await previewVideo.play();
        previewHint.style.display = "none";
      } catch {
        previewHint.textContent = "Tap to enable camera preview";
      }
    };

    const previewInterval = window.setInterval(() => {
      void attachMirrorPreview();
    }, 250);
    void attachMirrorPreview();

    // Cleanup: Remove the scene when this component unmounts
    return () => {
      window.clearInterval(previewInterval);
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }

      if (previewVideoRef.current) {
        previewVideoRef.current.srcObject = null;
      }
    };
  }, []); // Only run once on mount

  return (
    <div className="ar-viewport">
      <div ref={containerRef} className="ar-frame" />
    </div>
  );
});

export default ARScene;
