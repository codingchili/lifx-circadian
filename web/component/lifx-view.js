import {html, PolymerElement} from '../node_modules/@polymer/polymer/polymer-element.js'
import '../node_modules/@polymer/paper-tabs/paper-tabs.js'
import '../node_modules/@polymer/iron-pages/iron-pages.js'
import '../node_modules/@polymer/paper-card/paper-card.js'

import './lifx-lamp.js'
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
                    margin: 96px;
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
                
                .header {
                    font-size: 1.4em;
                    text-align: right;
                    right: 32px;
                    display: block;
                    padding: 8px;
                }
                
                .author {
                    margin-top: 8px;
                    display: block;
                }
            </style>
            <div>
                <!-- from rest api -->
                <paper-card id="container">
                    <span class="header">
                        Found 2 lamps                  
                    </span>
                    <div id="lamps">
                        <lifx-lamp name="Candy"></lifx-lamp>
                        <lifx-lamp name="Flory"></lifx-lamp>
                    </div>
                </paper-card>
            </div>
            <div id="footer">
                <span class="author">Robin Duda &copy;2019</span>
            </div>
        `;
    }
}

customElements.define("lifx-view", LifxView);