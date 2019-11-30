import {html, PolymerElement} from '../node_modules/@polymer/polymer/polymer-element.js'
import '../node_modules/@polymer/paper-swatch-picker/paper-swatch-picker.js'
import '../node_modules/@polymer/paper-slider/paper-slider.js'

import './lifx-trigger.js'
import '../style/lifx-style.js'

class LifxControls extends PolymerElement {

    constructor() {
        super();
    }

    static get template() {
        return html`
            <style include="lifx-style">
                #controls {
                
                }
                
                .control {
                    display: flex;
                    justify-content: space-between;
                }
                
                .hue {
                    margin-top: 18px !important;
                }
                
                .label {
                    margin-left: 8px;
                    margin-top: 6px;
                }
            </style>

            <div id="controls">
                <div class="control">
                    <span class="hue label">Hue</span>
                    <paper-swatch-picker></paper-swatch-picker>
                </div>
                
                <div class="control">
                    <span class="label">Saturation</span>
                    <paper-slider pin value="50"></paper-slider>
                </div>
                
                <div class="control">
                    <span class="label">Brightness</span>
                    <paper-slider pin value="50"></paper-slider>
                </div>
            </div>
        `;
    }

}

customElements.define("lifx-control", LifxControls);