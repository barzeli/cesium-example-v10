import { Directive, ElementRef, OnInit } from '@angular/core';
import { SceneMode, Viewer } from 'cesium';

@Directive({
  selector: '[appCesium]',
})
export class CesiumDirective implements OnInit {
  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    const viewer = new Viewer(this.elementRef.nativeElement, {
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      navigationHelpButton: false,
      sceneMode: SceneMode.SCENE2D,
      sceneModePicker: false,
      timeline: false,
    });
  }
}
