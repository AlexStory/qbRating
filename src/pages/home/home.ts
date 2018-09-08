import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Decimal } from 'decimal.js';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  isNfl: boolean = false;
  completions: number = 0;
  attempts: number = 0;
  yards: number = 0;
  touchdowns: number = 0;
  interceptions: number = 0;
  nflRating: number = 0;
  ncaaRating: number = 0;

  get percentWeighted():Decimal {
    let completions = new Decimal(this.completions || 0)
    let attempts = new Decimal(this.attempts || 0)
    let percentage =completions
      .dividedBy(attempts)
      .times(100)
      .minus(30)
      .dividedBy(20)
      .toDecimalPlaces(3)
    return this.getBounds(percentage)
  }
  get ypaWeighted(): Decimal {
    let ypa = new Decimal(this.yards || 0)
      .dividedBy(this.attempts || 0)
      .minus(3)
      .times(.25)
    
    return this.getBounds(ypa)
  } 
  get tdRatioWeighted():Decimal {
     let td =  new Decimal(this.touchdowns || 0)
      .dividedBy(this.attempts || 0)
      .times(100)
      .times(.2)

    return this.getBounds(td)
  }
  get intRatioWeighted(): Decimal {
    var intRatio = new Decimal(this.interceptions || 0)
    .dividedBy(this.attempts || 0)
    .times(100)
    .times(.25)
    let wRatio =  new Decimal(2.375)
      .minus(intRatio)

    return this.getBounds(wRatio)
  } 

  get ncaaYards(): Decimal {
    return new Decimal(8.4)
      .times(this.yards || 0)
  }

  get ncaaTd(): Decimal {
    return new Decimal(330)
      .times(this.touchdowns || 0)
  }

  get ncaaCompletions(): Decimal {
    return new Decimal(100)
      .times(this.completions || 0)
  }

  get ncaaInterceptions(): Decimal {
    return new Decimal(200)
      .times(this.interceptions || 0)
  }

  get ncaaRat() {
    return this.ncaaYards
      .plus(this.ncaaTd)
      .plus(this.ncaaCompletions)
      .minus(this.ncaaInterceptions)
      .dividedBy(this.attempts || 0)
  }

  get nflRat() {
   //return ((this.percentWeighted + this.ypaWeighted + this.tdRatioWeighted + this.intRatioWeighted) / .06).toFixed(0)
   return this.percentWeighted.plus(this.ypaWeighted).plus(this.tdRatioWeighted).plus(this.intRatioWeighted).dividedBy('.06').toDecimalPlaces(1)
  }

  private getBounds(decimal: Decimal): Decimal {
    if (decimal.lessThan(0)) {return new Decimal(0)}
    if (decimal.greaterThan(2.375)){return new Decimal(2.375)}
    return decimal
  }

  get valid(): boolean {
    return (this.attempts !== undefined 
    && this.completions !== undefined
    && this.yards !== undefined
    && this.touchdowns !== undefined
    && this.interceptions !== undefined)
  }

  get nflValid(): boolean {
    return !isNaN(this.nflRat.toNumber())
  }

  get ncaaValid(): boolean {
    return !isNaN(this.ncaaRat.toNumber())
  }

  get nanAttempts() {
    return isNaN(this.attempts)
  }


  constructor(public navCtrl: NavController) {

  }

}

