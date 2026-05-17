import Phaser from 'phaser';

export interface JoystickVector {
  x: number;
  y: number;
  magnitude: number;
  active: boolean;
}

export class VirtualJoystick {
  private readonly base: Phaser.GameObjects.Arc;
  private readonly thumb: Phaser.GameObjects.Arc;
  private readonly radius: number;
  private readonly onCapturePointer: (pointer: Phaser.Input.Pointer) => void;
  private readonly onPointerMove: (pointer: Phaser.Input.Pointer) => void;
  private readonly onPointerUp: (pointer: Phaser.Input.Pointer) => void;
  private pointerId: number | null = null;
  private vector: JoystickVector = { x: 0, y: 0, magnitude: 0, active: false };

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly centerX: number,
    private readonly centerY: number,
    radius = 42,
  ) {
    this.radius = radius;
    this.base = scene.add
      .circle(centerX, centerY, radius, 0x1f2933, 0.28)
      .setStrokeStyle(3, 0xd7c27c, 0.7)
      .setScrollFactor(0)
      .setDepth(1000);
    this.thumb = scene.add
      .circle(centerX, centerY, 18, 0x3b82f6, 0.88)
      .setStrokeStyle(2, 0xf7f4ea, 0.9)
      .setScrollFactor(0)
      .setDepth(1001);

    const hitRadius = radius + 22;
    this.base.setInteractive(new Phaser.Geom.Circle(0, 0, hitRadius), Phaser.Geom.Circle.Contains);
    this.thumb.setInteractive(new Phaser.Geom.Circle(0, 0, hitRadius), Phaser.Geom.Circle.Contains);

    this.onCapturePointer = (pointer: Phaser.Input.Pointer) => {
      this.pointerId = pointer.id;
      this.updateFromPointer(pointer);
    };

    this.base.on('pointerdown', this.onCapturePointer);
    this.thumb.on('pointerdown', this.onCapturePointer);

    this.onPointerMove = (pointer: Phaser.Input.Pointer) => {
      if (pointer.id !== this.pointerId) {
        return;
      }

      this.updateFromPointer(pointer);
    };

    this.onPointerUp = (pointer: Phaser.Input.Pointer) => {
      if (pointer.id !== this.pointerId) {
        return;
      }

      this.pointerId = null;
      this.reset();
    };

    scene.input.on('pointermove', this.onPointerMove);
    scene.input.on('pointerup', this.onPointerUp);
    scene.input.on('pointerupoutside', this.onPointerUp);
  }

  public getVector(): JoystickVector {
    return { ...this.vector };
  }

  public setVisible(visible: boolean): void {
    if (!visible) {
      this.pointerId = null;
      this.reset();
    }
    this.base.setVisible(visible);
    this.thumb.setVisible(visible);
  }

  public destroy(): void {
    this.pointerId = null;
    this.base.off('pointerdown', this.onCapturePointer);
    this.thumb.off('pointerdown', this.onCapturePointer);
    this.scene.input.off('pointermove', this.onPointerMove);
    this.scene.input.off('pointerup', this.onPointerUp);
    this.scene.input.off('pointerupoutside', this.onPointerUp);
    this.base.destroy();
    this.thumb.destroy();
  }

  private updateFromPointer(pointer: Phaser.Input.Pointer): void {
    const dx = pointer.x - this.centerX;
    const dy = pointer.y - this.centerY;
    const distance = Math.hypot(dx, dy);
    const clampRatio = distance > this.radius ? this.radius / distance : 1;
    const clampedX = dx * clampRatio;
    const clampedY = dy * clampRatio;
    const magnitude = Math.min(1, distance / this.radius);

    this.thumb.setPosition(this.centerX + clampedX, this.centerY + clampedY);
    this.vector = {
      x: Number((clampedX / this.radius).toFixed(3)),
      y: Number((clampedY / this.radius).toFixed(3)),
      magnitude: Number(magnitude.toFixed(3)),
      active: magnitude > 0.05,
    };
  }

  private reset(): void {
    this.thumb.setPosition(this.centerX, this.centerY);
    this.vector = { x: 0, y: 0, magnitude: 0, active: false };
  }
}
