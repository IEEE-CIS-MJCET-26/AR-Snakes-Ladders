import { useEffect } from 'react';

/**
 * ARScene
 * Wraps the A-Frame <a-scene> declaration.
 * Uses AR.js for marker detection.
 */
export default function ARScene() {
  // We need to inject A-Frame if not loaded globally, but for simplicity
  // we'll assume it's loaded in index.html index.html <head>
  // See public/index.html setup

  return (
    <a-scene
      id="ar-scene"
      embedded
      arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
      vr-mode-ui="enabled: false"
      renderer="logarithmicDepthBuffer: true; precision: medium;"
      style={{ position: 'fixed', inset: 0, zIndex: 1 }}
    >
      <a-assets>
        <img id="glow-tex" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" />
      </a-assets>

      {/* Marker A - HIRO */}
      <a-marker id="marker-A" preset="hiro" emitevents="true" smooth="true" smoothCount="5">
        <a-entity id="content-A" visible="false">
          <a-cylinder radius="0.4" height="0.02" color="#00f5a0" opacity="0.3" position="0 0 0"
            animation="property: rotation; to: 0 360 0; loop: true; dur: 4000; easing: linear" />
          <a-text value="7" color="#00f5a0" align="center" position="0 0.5 0" scale="2 2 2" font="exo2bold" />
        </a-entity>
      </a-marker>

      {/* Marker B - KANJI */}
      <a-marker id="marker-B" preset="kanji" emitevents="true" smooth="true" smoothCount="5">
        <a-entity id="content-B" visible="false">
          <a-cylinder radius="0.4" height="0.02" color="#f5c400" opacity="0.3" position="0 0 0"
            animation="property: rotation; to: 0 360 0; loop: true; dur: 4000; easing: linear" />
          <a-entity rotation="0 0 0">
            <a-cylinder radius="0.05" height="0.5" color="#f5c400" position="0 0.35 0" />
            <a-cone radius-bottom="0.15" radius-top="0" height="0.25" color="#f5c400" position="0 0.72 0" />
            <a-box width="0.3" height="0.05" depth="0.05" color="#b48b00" position="0 0.1 0" />
          </a-entity>
        </a-entity>
      </a-marker>

      {/* Marker C - LETTER-A */}
      <a-marker id="marker-C" type="pattern" url="/markers/pattern-letterA.patt" emitevents="true" smooth="true" smoothCount="5">
        <a-entity id="content-C" visible="false">
          <a-cylinder radius="0.4" height="0.02" color="#a855f7" opacity="0.3" position="0 0 0"
            animation="property: rotation; to: 0 360 0; loop: true; dur: 4000; easing: linear" />
          <a-text value="3" color="#c084fc" align="center" position="0.6 0.5 0" scale="1.5 1.5 1.5" font="exo2bold" />
          <a-entity rotation="0 0 0">
            <a-cylinder radius="0.05" height="0.5" color="#a855f7" position="0 0.35 0" />
            <a-cone radius-bottom="0.15" radius-top="0" height="0.25" color="#a855f7" position="0 0.72 0" />
            <a-box width="0.3" height="0.05" depth="0.05" color="#7c3aed" position="0 0.1 0" />
          </a-entity>
        </a-entity>
      </a-marker>

      {/* Marker D - LETTER-B */}
      <a-marker id="marker-D" type="pattern" url="/markers/pattern-letterB.patt" emitevents="true" smooth="true" smoothCount="5">
        <a-entity id="content-D" visible="false">
          <a-cylinder radius="0.4" height="0.02" color="#f97316" opacity="0.3" position="0 0 0"
            animation="property: rotation; to: 0 360 0; loop: true; dur: 4000; easing: linear" />
          <a-entity rotation="0 0 0">
            <a-cylinder radius="0.05" height="0.5" color="#f97316" position="0 0.35 0" />
            <a-cone radius-bottom="0.15" radius-top="0" height="0.25" color="#f97316" position="0 0.72 0" />
            <a-box width="0.3" height="0.05" depth="0.05" color="#c2410c" position="0 0.1 0" />
          </a-entity>
        </a-entity>
      </a-marker>

      {/* Marker E - FINAL LETTER-C */}
      <a-marker id="marker-E" type="pattern" url="/markers/pattern-letterC.patt" emitevents="true" smooth="true" smoothCount="5">
        <a-entity id="content-E" visible="false">
          <a-cylinder radius="0.4" height="0.02" color="#ec4899" opacity="0.3" position="0 0 0"
            animation="property: rotation; to: 0 360 0; loop: true; dur: 4000; easing: linear" />
          <a-text value="9" color="#f9a8d4" align="center" position="0.6 0.5 0" scale="1.5 1.5 1.5" font="exo2bold" />
          <a-entity rotation="0 0 0">
            <a-cylinder radius="0.05" height="0.5" color="#ec4899" position="0 0.35 0" />
            <a-cone radius-bottom="0.15" radius-top="0" height="0.25" color="#ec4899" position="0 0.72 0" />
            <a-box width="0.3" height="0.05" depth="0.05" color="#be185d" position="0 0.1 0" />
          </a-entity>
           {/* Victory star burst */}
          <a-entity
            animation="property: rotation; to: 0 360 0; loop: true; dur: 6000; easing: linear"
            position="0 1.5 0">
            <a-cone radius-bottom="0.06" radius-top="0" height="0.25" color="#fbbf24" rotation="0 0 0" position="0 0.15 0" />
            <a-cone radius-bottom="0.06" radius-top="0" height="0.25" color="#fbbf24" rotation="0 0 0" position="0.15 0 0" rotation="0 0 -90" />
          </a-entity>
        </a-entity>
      </a-marker>

      <a-entity camera />
    </a-scene>
  );
}
