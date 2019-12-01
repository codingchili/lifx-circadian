import {html, PolymerElement} from '../node_modules/@polymer/polymer/polymer-element.js'
import '../node_modules/@polymer/paper-card/paper-card.js'
import '../node_modules/@polymer/iron-icon/iron-icon.js'
import '../node_modules/@polymer/iron-icons/iron-icons.js'
import '../node_modules/@polymer/paper-tooltip/paper-tooltip.js'
import '../node_modules/@polymer/paper-dialog/paper-dialog.js'
import '../node_modules/@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js'

import './lifx-trigger.js'
import './lifx-control.js'
import '../style/lifx-style.js'

class LifxLamp extends PolymerElement {

    constructor() {
        super();
        this.triggers = [];
    }

    static get properties() {
        return {
            lamp: {
                type: 'Object',
                notify: true,
                value: {
                    name: "Unnamed Lamp"
                }
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
                
                #triggers {
                    position: absolute;
                }
                
                .interaction {
                    cursor: pointer;
                    display: block;
                    right: 12px;
                    top: 6px;
                }
                
                .apply {
                    width: 100%;
                    margin: 0;
                    height: 64px;
                }
                
                .add {
                    margin: auto;
                    left: 0;
                    padding-bottom: 16px;
                }
                
                .tooltip-text {
                    font-size: 1.4em;
                }
                
                #schema {
                    height: 764px;
                    width: 324px;
                }
                
                paper-dialog-scrollable {
                    --paper-dialog-scrollable: {
                        max-height: 64%;
                    }
                }
                
                #schema-footer {
                    position: absolute;
                    bottom: 0px;
                    left: 0;
                    right: 0;
                }
                
                @media screen and (max-width: 600px) {
                    #schema {
                        top: 0 !important;
                        bottom: 0!important;
                        left: 0 !important;
                        right: 0 !important;
                        margin: 0 !important;
                        width: unset;
                        height: unset;
                        position: fixed;
                    }
                }
               
            </style>
            
            <paper-card elevation="1">
                <span class="lamp-header">[[lamp.name]]</span>
                
                <iron-icon id="triggers" class="interaction" icon="icons:alarm" on-click="configure"></iron-icon>
                <paper-tooltip animation-delay="0" for="triggers">
                    <span class="tooltip-text">Configure triggers for this lamp</span>
                </paper-tooltip>
                
                <img id="bulb" style="[[_powerFilter(lamp.power)]]" on-click="_toggle">
                <!-- direct lamp controls -->
                <lifx-control lamp="{{lamp}}" autoupdate></lifx-control>
                
                <!-- hide, show dialog on schedule/timer icon click -->
                <paper-dialog id="schema" modal>
                    <h2>[[lamp.name]]</h2>
                    <iron-icon class="interaction add" icon="icons:alarm-add" on-click="add"></iron-icon>
                    <paper-dialog-scrollable>
                        <template is="dom-repeat" items="[[lamp.schemas]]">
                            <lifx-trigger trigger="{{item}}" delete="[[delete()]]"></lifx-trigger>
                        </template>
                    </paper-dialog-scrollable>
                    
                    <div id="schema-footer">                        
                        <paper-button class="apply" on-click="apply" raised>APPLY</paper-button>
                    </div>
                </paper-dialog>
            </paper-card>
        `;
    }

    configure() {
        this.$.schema.open();
    }

    ready() {
        super.ready();
        setTimeout(() => {
            this.shadowRoot.querySelector('#bulb').src = "./img/bulb.png";
        }, 200);
    }

    delete() {
        return (item) => {
            this.triggers = this.triggers.filter((e) => {
                return e !== item;
            });
        };
    }

    add() {
        this.push('triggers', {
            saturation: 98,
            brightness: 33,
            transition: 60,
            hue: '#42a5f5',
            cron: '30 7 * * *'
        });
    }

    _powerFilter() {
        return (this.lamp.power) ? '' : 'filter: grayscale(1);'
    }

    _toggle() {
        this.set('lamp.power', !this.lamp.power);
    }

    apply() {
        this.$.schema.close();
    }

}

customElements.define("lifx-lamp", LifxLamp);
