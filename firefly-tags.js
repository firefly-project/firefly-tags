import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';

import './polymerfire/firebase-auth.js'
import './polymerfire/firebase-query.js'
import './polymerfire/firebase-document.js'
import './paper_chip/paper-chip-input-autocomplete.js';

/**
 * `firefly-tags` This component displays a list of tags. An autocomplete component gives the user
 * a list of suggested tags. A firebase query makes use of the 'suggested-values-path', to get a list
 * of suggestions.  When the user makes a selection, the selection is stored in two places:
 *  - in a model node (i.e. 'model.tags')
 *  - as subnodes of the 'selected-values-path' (i.e. /tags-companies/{tagId}/{companyObject}), 
 *    this makes it possible to easily query all companies that have a specific tag
 *
 * @summary This component displays a list of tags.
 * @customElement
 * @polymer
 * @extends {Polymer.Element}
 */
class FireflyTags extends PolymerElement {
  static get template() {
    return html`
        <style>
            :host {
                display: block
            }
        </style>

        <firebase-auth app-name="[[appName]]"></firebase-auth>
        <firebase-query id="suggestionsQuery" app-name="[[appName]]" path="[[suggestedValuesPath]]" order-by-value="" start-at="[[start]]" on-data-changed="__handleDataChanged" limit-to-first="5" log=""></firebase-query>
        <firebase-query id="selectionsQuery" app-name="[[appName]]" path="[[selectedValuesPath]]"></firebase-query>
        
        <paper-chip-input-autocomplete closable="" additional-items="" label="[[label]]" items="{{__tags}}" source="[[__suggestions]]" pattern="{{start}}"></paper-chip-input-autocomplete>
`;
  }

  /**
   * String providing the tag name to register the element under.
   */
  static get is() {
      return 'firefly-tags';
  }

  /**
   * Object describing property-related metadata used by Polymer features
   */
  static get properties() {
      return {

          /** The name of the firebase application. */
          appName:{
              type: String,
              value: ''
          },

          /** The label for the field. */
          label:{
              type: String,
              value: ''
          },
          
          /** The query path used to retrieve the suggestions. */
          suggestedValuesPath:{
              type: String,
              value: ''
          },

          /** 
           * An Array<String> of suggested tags based on the value entered 
           * by the user in the autocomplete field. 
           */
          __suggestions:{
              type: Array,
              value: []
          },

          /** An Array<String> of values selected by the user. */
          tags:{
              type: Array,
              value: [],
              observer: '__tagsInitialized'
          },

          __tags:{
              type: Array,
              value: []
          },

          /** The query path used to save selected values. */
          selectedValuesPath:{
              type: String,
              value: ''
          },


          selectedValuesNodePath:{
              type: String,
              value: ''
          }


          
      };
  }

  __handleDataChanged(e){
      let data = e.detail.value;
      let suggestions = [];
      for(let item of data){
          suggestions.push({text:item.$val, value: item.$val});
      }
      this.set('__suggestions', suggestions);
  }

  __tagsInitialized(tags){
      if(tags && Array.isArray(tags) && tags.length > 0){
          this.set('__tags', tags);
      }else{
          this.set('__tags', []);
      }
  }

  /**
   * Instance of the element is created/upgraded. Use: initializing state,
   * set up event listeners, create shadow dom.
   * @constructor
   */
  constructor() {
      super();
  }

  /**
   * Use for one-time configuration of your component after local DOM is initialized. 
   */
  ready() {
      super.ready();

      afterNextRender(this, function() {
          
      });
  }

  /**
   * This method is triggered whenever a tag is added to the field. If the tag is not in
   * the __suggestions field, then it will be added to the /tags node.
   * @param {Event} e the event object
   */
  __handleChipCreated(e){
      e.stopPropagation();
      let tag = e.detail.chipLabel;
      if(this.__suggestions.indexOf(tag) == -1){
          this.$.suggestionsQuery.ref.push(tag);
      }

      this.dispatchEvent(new CustomEvent('tag-added', {
          bubbles: true,
          composed: true,
          detail: {
              tags: this.get('__tags')
          }
      }));
      
  }

  /**
   * This method is triggered whenever a tag is removed from the field.
   * @param {Event} e the event object
   */
  __handleChipDeleted(e){
      e.stopPropagation();
      

      this.dispatchEvent(new CustomEvent('tag-removed', {
          bubbles: true,
          composed: true,
          detail: {
              tags: this.__tags
          }
      }));


  }

  /**
    * Called every time the element is inserted into the DOM. Useful for 
    * running setup code, such as fetching resources or rendering.
    * Generally, you should try to delay work until this time.
    */
  connectedCallback() {
      super.connectedCallback();

      let chipTray = this.shadowRoot.querySelector("paper-chip-input-autocomplete")
      chipTray.addEventListener('chip-created', e => this.__handleChipCreated(e));
      chipTray.addEventListener('chip-removed', e => this.__handleChipDeleted(e));

  
  }

  /**
    * Called every time the element is removed from the DOM. Useful for 
    * running clean up code (removing event listeners, etc.).
    */
  disconnectedCallback() {
      super.disconnectedCallback();
  
      let chipTray = this.shadowRoot.querySelector("paper-chip-input-autocomplete")
      chipTray.removeEventListener('chip-created', e => this.__handleChipCreated(e));
      chipTray.removeEventListener('chip-removed', e => this.__handleChipDeleted(e));
      
  
  }
}

window.customElements.define(FireflyTags.is, FireflyTags);
