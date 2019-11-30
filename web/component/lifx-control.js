import {html, PolymerElement} from '../node_modules/@polymer/polymer/polymer-element.js'
import '../node_modules/@polymer/paper-swatch-picker/paper-swatch-picker.js'
import '../node_modules/@polymer/paper-slider/paper-slider.js'

import './lifx-trigger.js'
import '../style/lifx-style.js'

class LifxControls extends PolymerElement {

    constructor() {
        super();
    }

    static get properties() {
        return {
            lamp: {
                type: Object,
                notify: true
            },
            transition: {
                type: Boolean
            }
        }
    }

    static get observers() {
        return ['_onColorChange(lamp.hue)'];
    }

    static get template() {
        return html`
            <style include="lifx-style">
                  
                .hue {
                    margin-top: 22px !important;
                }
                
                .control {
                    display: flex;
                    justify-content: space-evenly;
                }
                
                paper-slider {
                    --paper-slider-active-color: var(--lamp-hue);
                    --paper-slider-secondary-color: var(--lamp-hue);
                    --paper-slider-knob-color: var(--lamp-hue);
                    --paper-slider-pin-color:  var(--lamp-hue);
                }
            </style>

            <div id="controls">
                <div class="control">
                    <span class="hue label">Hue</span>
                    <paper-swatch-picker color="{{lamp.hue}}"></paper-swatch-picker>
                </div>
                
                <div class="control">
                    <span class="label">Saturation</span>
                    <paper-slider ignoreBarTouch pin value="{{lamp.saturation}}"></paper-slider>
                </div>
                
                <div class="control">
                    <span class="label">Brightness</span>
                    <paper-slider ignoreBarTouch pin value="{{lamp.brightness}}"></paper-slider>
                </div>
                
                <template is="dom-if" if="[[transition]]">
                    <div class="control">
                        <span class="label">Transition</span>
                        <paper-slider ignoreBarTouch pin value="{{lamp.transition}}"></paper-slider><!--max-markers="300" step="5"-->
                    </div>
                </template>
            </div>
        `;
    }

    _onColorChange() {
        this.style.setProperty("--lamp-hue", this.lamp.hue);
    }
}

customElements.define("lifx-control", LifxControls);