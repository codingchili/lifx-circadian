import {html, PolymerElement} from '../node_modules/@polymer/polymer/polymer-element.js'
import '../node_modules/@polymer/paper-tabs/paper-tabs.js'
import '../node_modules/@polymer/iron-pages/iron-pages.js'
import '../node_modules/@polymer/paper-card/paper-card.js'
import '../node_modules/@polymer/paper-tooltip/paper-tooltip.js'
import '../node_modules/@polymer/iron-icon/iron-icon.js'
import '../node_modules/@polymer/iron-icons/iron-icons.js'

import './lifx-lamp.js'
import './lifx-authentication.js'
import '../style/lifx-style.js'

class LifxView extends PolymerElement {

    static get template() {
        return html`
            <style include="lifx-style">
                #lamps {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    justify-content: center;
                    padding-bottom: 32px;
                }
                
                #container {
                    margin: 64px 96px 96px;
                }
                
                lifx-lamp {
                    margin: 16px;
                }
                
                @keyframes spin { 
                100% 
                    { 
                        transform:rotate(360deg); 
                    } 
                }
                
                #refresh {
                     animation: spin 0.5s linear infinite;
                     transition: 0.2s opacity;
                }
                
                .tooltip-text {
                    font-size: 1.4em;
                }
                
                #footer {
                    position: absolute;
                    display: block;
                    text-align: center;
                    background-color: #eee;
                    height: 34px;
                    bottom: 0;
                    left: 0;
                    right: 0;
                }
                
                #header {
                    font-size: 2em;
                    opacity: 0.76;
                    text-align: center;
                    display: block;
                    margin-top: 64px;
                }
                
                .lamps-header {
                    font-size: 1.4em;
                    text-align: right;
                    right: 32px;
                    display: block;
                    padding: 8px;
                    height: 16px;
                }
                
                .lamps-footer {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px;
                    opacity: 0.76;
                }
                
                .author {
                    margin-top: 8px;
                    display: block;
                }
                
                @media screen and (max-width:600px) {
                    #container {
                        position: absolute;
                        left: 0;
                        right: 0;
                        top: 0;
                        bottom: 34px;
                        margin: 0;
                    }
                    
                    .lamps-footer {
                        position: absolute;
                        bottom: 4px;
                        left: 0;
                        right: 0;
                    }
                }
                
            </style>
            <div>
                <span id="header">
                    LIFX - Circadian
                </span>
                <template is="dom-if" if="[[authenticated]]">
                    <paper-card elevation="3" id="container">
                        <span class="lamps-header">
                            <iron-icon id="refresh" style$="[[_visibility(updating)]]" icon="icons:refresh" on-click="update"></iron-icon>
                            <paper-tooltip animation-delay="0" for="refresh">
                                <span class="tooltip-text">Updating..</span>
                            </paper-tooltip>        
                        </span>
                        <div id="lamps">
                            <template is="dom-repeat" items="[[lamps]]">
                                <lifx-lamp lamp="[[item]]"></lifx-lamp>
                            </template>
                        </div>
                        <div class="lamps-footer">
                            <div>Last scan [[lastScan]]</div>
                            <div>Found [[lamps.length]] lamps</div>
                        </div>
                    </paper-card>
                </template>
                
                <template is="dom-if" if="[[!authenticated]]">
                    <lifx-authentication id="authenticator"></lifx-authentication>                
                </template>
            </div>
           
            <div id="footer">
                <span class="author">Robin Duda &copy;2019</span>
            </div>
        `;
    }

    ready() {
        super.ready();
        this.authenticated = true;
        this.updating = false;
        this.lamps = [];

        setTimeout(() => {
            let authenticator = this.shadowRoot.getElementById('authenticator');
            if (authenticator) {
                authenticator.onAuthenticated(this.onAuthenticated.bind(this));
            }
            this.update();
        }, 0);

        setInterval(() => this.update(), 5000);
    }

    _visibility() {
        return this.updating ? 'opacity: 1.0;' : 'opacity: 0;';
    }

    update() {
        this.updating = true;
        fetch('/lamps')
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                this.set('lamps', data);
                this.lastScan = new Date().toUTCString();
                setTimeout(() => this.updating = false, 400);
            });
    }

    onAuthenticated(e) {
        this.authenticated = true;
    }
}

customElements.define("lifx-view", LifxView);