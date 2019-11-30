import {html, PolymerElement} from '../node_modules/@polymer/polymer/polymer-element.js'
import '../node_modules/@polymer/paper-tabs/paper-tabs.js'
import '../node_modules/@polymer/iron-pages/iron-pages.js'
import '../node_modules/@polymer/paper-card/paper-card.js'

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
                <h2 id="header">
                    LIFX - Circadian
                </h2>
                <template is="dom-if" if="[[authenticated]]">
                    <paper-card elevation="3" id="container">
                        <span class="lamps-header">                  
                        </span>
                        <div id="lamps">
                            <lifx-lamp name="Candy"></lifx-lamp>
                            <lifx-lamp name="Flory"></lifx-lamp>
                        </div>
                        <div class="lamps-footer">
                            <div>Last scan 2019-11-29 14:01PM</div>
                            <div>Found 2 lamps</div>
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

        setTimeout(() => {
            let authenticator = this.shadowRoot.getElementById('authenticator');
            if (authenticator) {
                authenticator.onAuthenticated(this.onAuthenticated.bind(this));
            }
        }, 0);
    }

    onAuthenticated(e) {
        this.authenticated = true;
    }
}

customElements.define("lifx-view", LifxView);