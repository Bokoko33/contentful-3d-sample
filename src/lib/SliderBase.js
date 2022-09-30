/**
 * スライドショーの土台
 * タブがアクティブ / 非アクティブのときの挙動について、
 * 演出によく使われるgsapと仕様を合わせるため、この土台にもgsapを使用
 */
import { gsap } from 'gsap';
const EventEmitter = require('events').EventEmitter;

export class SliderBase extends EventEmitter {
  constructor(props) {
    if (props.slideCount === undefined) {
      throw new Error('No SlideCount Error');
    }

    super();

    this.slideCount = props.slideCount; // 総スライド数
    this.autoplay = props.autoplay || false; // 自動再生するかどうか
    this.interval = props.interval || 2000; // 自動再生の間隔[ms]
    this.reverse = props.reverse || false; // 自動再生が逆再生かどうか

    this.current = 0; // 現在のスライド番号
    this.before = 0; // 前回のスライド番号（prevではなく、前にいたスライドの番号）

    // 自動再生時のタイマー。gsapを使う理由はファイル上部参照。
    this.timer = this.autoplay
      ? gsap.to(
          {},
          {
            ease: 'none',
            duration: this.interval / 1000, // [ms]→[s]
            onComplete: () => {
              this.autoChange();
            },
            onUpdate: () => {
              this.emit('update');
            },
          }
        )
      : null;
  }

  // 指定番号の前の番号（指定が0なら最終番号）を返す。指定しなければcurrentから参照する
  getPrev(number = this.current) {
    if (number <= 0) return this.slideCount - 1;
    else return number - 1;
  }

  // 指定番号の次の番号（指定が最終番号なら0）を返す。指定しなければcurrentから参照する
  getNext(number = this.current) {
    if (number >= this.slideCount - 1) return 0;
    else return number + 1;
  }

  // スライドを前に送る
  prev() {
    const number = this.getPrev();
    this.change(number);
    this.emit('prev');
  }

  // スライドを次に送る
  next() {
    const number = this.getNext();
    this.change(number);
    this.emit('next');
  }

  // 指定の番号にスライドを切り変える。スライド番号が必須
  change(number) {
    if (number === undefined) {
      throw new Error('No Change Number Error');
    }

    this.before = this.current;
    this.current = number;

    this.restartTimer();

    this.emit('change');
  }

  // 自動再生時のスライド切り替え（前 or 次）
  autoChange() {
    this.reverse ? this.prev() : this.next();
  }

  restartTimer() {
    this.timer?.restart();
  }

  sleepTimer() {
    this.timer?.pause();
  }

  dispose() {
    this.timer?.kill();
  }
}
