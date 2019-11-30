const styleElement = document.createElement('dom-module');
styleElement.innerHTML =
    `<template>
    <style>
        * {
            font-family: 'Open Sans', sans-serif;
            font-size: 14px;
            --lifx-color-theme: #82004f;
        }

        paper-tabs {
            --paper-tabs-selection-bar-color: var(--lifx-color-theme);
        }

        paper-tab {
            --paper-tab-ink: var(--lifx-color-theme);
        }

        paper-toast {
            --paper-toast-background-color: #ff8c00;
            text-align: center;
        }

        paper-button {
            --paper-button-ink-color: var(--lifx-color-theme);
        }

        paper-checkbox {
            --paper-checkbox-checked-color: var(--lifx-color-theme);
        }

        paper-input-container, paper-input {
            --paper-input-container-focus-color: var(--lifx-color-theme);
        }

        paper-card {
            display: block;
        }
        
        paper-slider {
            --paper-slider-active-color: var(--lifx-color-theme);
            --paper-slider-secondary-color: var(--lifx-color-theme);
            --paper-slider-knob-color: var(--lifx-color-theme);
            --paper-slider-pin-color:  var(--lifx-color-theme);
        }
        
        .label {
            margin-left: 8px;
            margin-top: 6px;
            opacity: 0.76;
        }
        
        .interaction:hover {
            color: var(--lifx-color-theme);
            cursor: pointer;
        }

        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-thumb {
          background: red;

        }

        ::-webkit-scrollbar-thumb:hover {
          background: #b30000;
        }
    </style>
  </template>`;
styleElement.register('lifx-style');