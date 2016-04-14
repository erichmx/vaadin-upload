import {
  Injector,
  Directive,
  ElementRef,
  Output,
  HostListener,
  EventEmitter,
  Provider,
  forwardRef,
  Renderer
} from 'angular2/core';
import { NgControl, NG_VALUE_ACCESSOR, DefaultValueAccessor } from 'angular2/common';
import { CONST_EXPR } from 'angular2/src/facade/lang';
declare var HTMLImports;

const VAADIN_UPLOAD_CONTROL_VALUE_ACCESSOR = CONST_EXPR(new Provider(
    NG_VALUE_ACCESSOR, {
      useExisting: forwardRef(() => VaadinUpload),
      multi: true
    }));

@Directive({
  selector: 'vaadin-upload',
  providers: [VAADIN_UPLOAD_CONTROL_VALUE_ACCESSOR]
})
export class VaadinUpload extends DefaultValueAccessor {

  private _element;
  private _initialValueSet = false;

  @Output() filesChange: EventEmitter<any> = new EventEmitter(false);
  @HostListener('files-changed')
  fileschanged() {
    if (!this._initialValueSet) {
      // Do not trigger onChange when the initial (empty) value is set
      // to keep the field as "pristine".
      this._initialValueSet = true;
      return;
    }

    const value = this._element.files;
    this.filesChange.emit(value);
    this.onChange(value);
  }

  importHref(href) {
    if (!document.querySelector('head link[href="' + href + '"]')) {
      const link = document.createElement('link');
      link.rel = 'import';
      link.href = href;
      document.head.appendChild(link);
    }
    HTMLImports.whenReady(this.onImport.bind(this));
  }

  onImport() {
    this._element.$$('paper-button').addEventListener('blur', () => {
      this.onTouched();
    });
  }

  constructor(renderer: Renderer, el: ElementRef,  private _injector: Injector) {
    super(renderer, el);
    this._element = el.nativeElement;
    this.importHref('bower_components/vaadin-upload/vaadin-upload.html');
  }

}