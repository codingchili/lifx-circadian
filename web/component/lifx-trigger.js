import {PolymerElement, html} from '../node_modules/@polymer/polymer/polymer-element.js'
import '../node_modules/@polymer/paper-slider/paper-slider.js'
import '../node_modules/@polymer/paper-input/paper-input.js'
import '../node_modules/@polymer/paper-button/paper-button.js'
import '../node_modules/@polymer/iron-icon/iron-icon.js'
import '../node_modules/@polymer/iron-icons/iron-icons.js'


import './lifx-control.js'
import '../style/lifx-style.js'

class LifxTrigger extends PolymerElement {

    static get properties() {
        return {
            trigger: {
                type: Object,
                notify: true
            },
            delete: {
                notify: true
            }
        };
    }

    static get template() {
        return html`
            <style include="lifx-style">
                .remove {
                    display: block;
                    left: 0;
                    margin: 16px auto auto;
                }
            </style>

            <paper-input placeholder="cron expression" value="{{trigger.cron}}"></paper-input>
            <lifx-control lamp="{{trigger}}" transition></lifx-control>

            <iron-icon class="interaction remove" icon="alarm-off" on-click="_delete"></iron-icon>            
        `;
    }

    _delete() {
        this.delete(this.trigger);
    }
}

customElements.define("lifx-trigger", LifxTrigger);