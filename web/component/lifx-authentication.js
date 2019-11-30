import {html, PolymerElement} from '../node_modules/@polymer/polymer/polymer-element.js'
import '../node_modules/@polymer/paper-card/paper-card.js'
import '../node_modules/@polymer/paper-input/paper-input.js'

import '../style/lifx-style.js'

class LifxAuthentication extends PolymerElement {

    constructor() {
        super();
    }

    static get properties() {
        return {
            authenticated: {
                type: 'function'
            }
        };
    }

    static get template() {
        return html`
            <style include="lifx-style">                
              :root {
                    max-width: 328px;
                    margin: 64px auto auto;
              }
              
              #key {
                padding-left: 16px;
                padding-right: 16px;
              }
              
              .key-label {
                top: 0px;
                position: absolute;
              }
              
              .hint {
                opacity: 0.76;
                display: block;
                margin-left: 16px;
                margin-right: 16px;
                margin-top: 32px;
              }
            </style>

            <paper-card id="container">
                <span class="label key-label">Key</span>
                <paper-input id="key" type="password" placeholder="authentication key" on-keydown="enter" value="{{key}}" autofocus></paper-input>
                <span class="hint">
                    An authentication key is required to access the management interface and the API's.
                </span>
            </paper-card>
        `;
    }

    enter(e) {
        if (e.key === 'Enter') {
            this.handler(this.key);
            this.key = '';
        }
    }

    onAuthenticated(handler) {
        this.handler = handler;
    }
}

customElements.define("lifx-authentication", LifxAuthentication);