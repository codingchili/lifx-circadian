import {PolymerElement, html} from '../node_modules/@polymer/polymer/polymer-element.js'
import '../node_modules/@polymer/paper-card/paper-card.js'
import '../node_modules/@polymer/iron-collapse/iron-collapse.js'

import './lifx-trigger.js'
import './lifx-control.js'
import '../style/lifx-style.js'

class LifxLamp extends PolymerElement {

    constructor() {
        super();
    }

    static get properties() {
        return {
            name: {
                type: 'String'
            }
        };
    }

    static get template() {
        return html`
            <style include="lifx-style">
            
                :host {
                    max-width: 278px;
                    min-width: 278px;
                }
            
                #bulb {
                    width: 96px;
                    height: 96px;
                    cursor: pointer;
                    display: flex;
                    margin: auto;
                }
                
                .lamp-header {
                    text-align: center;
                    display: block;
                    margin-top: 8px;
                    font-size: 1.2em;
                    padding-bottom: 4px;
                }
            </style>
            
            <paper-card>
                <span class="lamp-header">[[name]]</span>
                <img id="bulb" src="/img/bulb.png">
                <!-- direct lamp controls -->
                <lifx-control></lifx-control>
                
                <!-- hide, show dialog on schedule/timer icon click -->
                <iron-collapse>
                    <lifx-trigger></lifx-trigger>
                    <lifx-trigger></lifx-trigger>
                    <lifx-trigger></lifx-trigger>
                </iron-collapse>
                <!-- save button -->
            </paper-card>
            
            <!-- toggle on/off on img click -->
        `;
    }

}

customElements.define("lifx-lamp", LifxLamp);