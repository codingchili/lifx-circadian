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
            },
            autoupdate: {
                type: Boolean
            }
        }
    }

    static get observers() {
        return ['_onColorChange(color)', '_onLampColorChange(lamp.color)', '_onValueChanged(lamp.saturation, lamp.brightness, lamp.color)'];
    }

    static get template() {
        return html`
            <style include="lifx-style">
                  
                .color {
                    margin-top: 22px !important;
                }
                
                paper-slider {
                    --paper-slider-active-color: var(--lamp-color);
                    --paper-slider-secondary-color: var(--lamp-color);
                    --paper-slider-knob-color: var(--lamp-color);
                    --paper-slider-pin-color:  var(--lamp-color);
                }
            </style>

            <div id="controls">
                <div class="control">
                    <span class="color label">Hue</span>
                    <paper-swatch-picker color="{{color}}"></paper-swatch-picker>
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

    connectedCallback() {
        super.connectedCallback();
        this.color = this.lamp.color;
        this._onColorChange();
    }

    _onLampColorChange() {
        this.set('color', this.lamp.color);
    }

    _onColorChange() {
        // shadowed because two-way binding on the color picker overwrites the original value.
        this.set('lamp.color', this.color);
        this.style.setProperty("--lamp-color", this.lamp.color);
    }

    _onValueChanged(saturation, brightness, color) {
        console.log(`s=${saturation} b=${brightness} c=${color}`);

        fetch('/lamp/update', {
            method: 'post',
            body: JSON.stringify(this.lamp)
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
        });
    }
}

customElements.define("lifx-control", LifxControls);