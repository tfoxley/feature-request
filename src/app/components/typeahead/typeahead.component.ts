import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  OnInit,
  Optional,
  Output,
  QueryList,
  Self,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroupDirective,
  NgControl,
  NgForm
} from '@angular/forms';
import { TypeaheadItemComponent } from '../typeahead-item/typeahead-item.component';
import { HcFormControlComponent } from '@wcf-insurance/cashmere';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'hc-typeahead',
  templateUrl: './typeahead.component.html',
  styleUrls: ['./typeahead.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: HcFormControlComponent,
      useExisting: forwardRef(() => TypeaheadComponent)
    }
  ]
})
export class TypeaheadComponent extends HcFormControlComponent
  implements OnInit, AfterContentInit, ControlValueAccessor {
  private DIRECTION = {
    UP: 'up',
    DOWN: 'down'
  };

  _searchTerm: FormControl;
  _resultPanelHidden = true;
  _highlighted = 0;

  public _value = '';

  /** Number of characters required before the typehead will begin searching */
  @Input()
  minChars = 1;

  /** Placeholder text for the input box of the typeahead */
  @Input()
  placeholder = '';

  /** Event emitted after each key stroke in the typeahead box (after minChars requirement has been met) */
  @Output()
  valueChange: EventEmitter<any> = new EventEmitter<any>();

  /** Event emitted when an option is selected from the list of typeahead results */
  @Output()
  optionSelected: EventEmitter<any> = new EventEmitter<any>();

  @ContentChildren(TypeaheadItemComponent)
  _options: QueryList<TypeaheadItemComponent>;

  @ViewChild('input') _inputRef: ElementRef;
  @ViewChild('results') _resultPanel: ElementRef;
  @ViewChild('toggle') _resultToggle: ElementRef;

  constructor(@Optional() @Inject(DOCUMENT) private _document: any) {
    super();
  }

  ngOnInit() {
    this._searchTerm = new FormControl(this._value);
    this._resultPanelHidden = true;
    this._highlighted = 0;

    document.body.addEventListener('click', this.handleClick.bind(this));
  }

  private handleClick(event) {
    if (this._resultPanelHidden !== true) {
      const clickTarget = event.target as HTMLElement;
      if (
        clickTarget !== this._inputRef.nativeElement &&
        clickTarget !== this._resultPanel.nativeElement &&
        !this._resultToggle.nativeElement.contains(clickTarget) &&
        !this._inputRef.nativeElement.contains(clickTarget) &&
        !this._resultPanel.nativeElement.contains(clickTarget)
      ) {
        this.hideResultPanel();
      }
    }
  }

  ngAfterContentInit() {
    this._options.changes.subscribe(() => {
      this.listenForSelection();

      setTimeout(() => this.setHighlighted(0, true));
    });
  }

  private listenForSelection() {
    this._options.toArray().forEach(option => {
      option._selected.subscribe(() => {
        this.itemSelectedDefault(option.value);
      });
    });
  }

  _filterData($event: any) {
    if ($event.keyCode === 27) {
      // handle esc key
      this.hideResultPanel();
      this.setHighlighted(0, true);
    } else if ($event.keyCode === 40) {
      // handle arrow down
      if (this._resultPanelHidden) {
        this.showResultPanel();
      } else {
        if (
          this._highlighted < this._options.length - 1 &&
          this._options.length > 0
        ) {
          this._highlighted = this._highlighted + 1;
          this.changeHighlighted(this.DIRECTION.DOWN);
        }

        this.scrollTop();
      }
    } else if ($event.keyCode === 38) {
      // handle arrow up
      if (!this._resultPanelHidden) {
        if (this._highlighted > 0) {
          this._highlighted = this._highlighted - 1;
          this.changeHighlighted(this.DIRECTION.UP);
        }

        this.scrollTop();
      }
    } else if ($event.keyCode === 13) {
      // handle enter key
      $event.preventDefault();
      $event.stopPropagation();
      this.itemSelectedDefault(
        this._options.toArray()[this._highlighted].value
      );
    } else {
      const value = this._inputRef.nativeElement.value;
      if (value.length >= this.minChars && value !== this._value) {
        if (this._resultPanelHidden) {
          this.showResultPanel();
        }

        // In case the search returns some of the same results but the top result
        // has moved down the list we need to remove the highlighting from it
        // and add highlighting to the new number 1.
        this.setHighlighted(0, false);
        this.valueChange.emit(value);
        setTimeout(() => this.setHighlighted(0, true));
      }
    }
  }

  private scrollTop() {
    if (this._resultPanel) {
      this._resultPanel.nativeElement.scrollTop = this.getOptionScrollPosition(
        31,
        200
      );
    }
  }

  private getOptionScrollPosition(
    optionHeight: number,
    panelHeight: number
  ): number {
    const currentScrollPosition = this._resultPanel.nativeElement.scrollTop;
    const optionOffset = this._highlighted * optionHeight;

    if (optionOffset < currentScrollPosition) {
      return optionOffset;
    }

    if (optionOffset + optionHeight > currentScrollPosition + panelHeight) {
      return Math.max(0, optionOffset - panelHeight + optionHeight);
    }

    return currentScrollPosition;
  }

  _toggleShowResults() {
    if (this._resultPanelHidden) {
      this.showResultPanel();
      this.valueChange.emit('');
    } else {
      this.hideResultPanel();
    }
  }

  private showResultPanel() {
    this._resultPanelHidden = false;

    // set the first option as the highlighted option
    this._highlighted = 0;
    this.setHighlighted(0, true);

    this._inputRef.nativeElement.focus();
  }

  private hideResultPanel() {
    this._resultPanelHidden = true;
    this.closePanel();
  }

  private closePanel() {
    // remove highlighting from currently selected option
    this.setHighlighted(this._highlighted, false);

    // reset scroll
    if (this._resultPanel) {
      this._resultPanel.nativeElement.scrollTop = 0;
    }

    // set highlighted to the first one
    this.setHighlighted(0, true);
    this._highlighted = 0;
  }

  private itemSelectedDefault(item) {
    this.hideResultPanel();
    this.optionSelected.emit(item);
  }

  private changeHighlighted(direction: string) {
    if (direction === this.DIRECTION.DOWN && this._highlighted > 0) {
      this.setHighlighted(this._highlighted - 1, false);
    } else if (
      direction === this.DIRECTION.UP &&
      this._highlighted < this._options.length - 1
    ) {
      this.setHighlighted(this._highlighted + 1, false);
    }

    if (this._highlighted < this._options.length) {
      this.setHighlighted(this._highlighted, true);
    }
  }

  private setHighlighted(index: number, highlighted: boolean) {
    const option = this._options.toArray()[index];
    if (option) {
      option._highlighted = highlighted;
    }
  }

  private onChange(val: any) {}

  private onTouched(val: any) {}

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: string): void {
    this._value = value;
    if (this._searchTerm) {
      this._searchTerm.setValue(value);
    }
  }

  /** Get or set the value of the select component */
  @Input()
  get value() {
    return this._value;
  }

  set value(val: string) {
    if (val !== this._value) {
      this.writeValue(val);
      this.onChange(val);
    }
  }

  /** Enables or disables the component */
  @Input()
  get disabled(): boolean {
    return this._isDisabled;
  }

  set disabled(disabledVal) {
    this._isDisabled = this.parseBooleanAttribute(disabledVal);
  }

  /** Sets whether this is a required form element */
  @Input()
  get required(): boolean {
    return this._isRequired;
  }

  set required(requiredVal) {
    this._isRequired = this.parseBooleanAttribute(requiredVal);
  }

  parseBooleanAttribute(value: boolean | string): boolean {
    if (typeof value === 'boolean') {
      return value;
    }
    if (value.toLowerCase() === 'false') {
      return false;
    }
    if (value.toLowerCase() === 'true' || value === '') {
      return true;
    }
    throw Error(String(value) + ' is not a boolean value');
  }
}
