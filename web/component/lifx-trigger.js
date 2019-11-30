import {PolymerElement, html} from '../node_modules/@polymer/polymer/polymer-element.js'
import '../node_modules/@polymer/paper-slider/paper-slider.js'
import '../node_modules/@polymer/paper-input/paper-input.js'
import '../node_modules/@polymer/paper-button/paper-button.js'

import './lifx-control.js'
import '../style/lifx-style.js'

class LifxTrigger extends PolymerElement {

    static get template() {
        return html`
            <style include="lifx-style"></style>

            <span>trigger configuration [name] icon:remove</span>
            <lifx-control></lifx-control>
            
            <paper-slider id="transition" pin snaps max="10" max-markers="10" step="1" value="5"></paper-slider>
            <paper-button raised>APPLY</paper-button>
        `;
    }

    /* on lamp control change: update lamp or save trigger */

}

customElements.define("lifx-trigger", LifxTrigger);