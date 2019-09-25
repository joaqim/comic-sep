import React from 'react';

export default class EventComponent extends React.Component {

  constructor(props) {
    super(props);

    this._onTouchStart = this._onTouchStart.bind(this);
    this._onTouchMove = this._onTouchMove.bind(this);
    this._onTouchEnd = this._onTouchEnd.bind(this);

    this.state = { swiped: false };
    this._swipe = {};
    this.minDistance = 50;
    //this.centerMargin = 600;
  }

  _onTouchStart(e) {
    const touch = e.touches[0];
    // If multiple touches? Ignore ?
    if (e.touches.length > 1) {
      this._swipe = {}
      this.setState({ swiped: false })
      return
    }
    const centerX = window.innerWidth / 2;
    const centerMargin = centerX / 2;
    const x = touch.clientX;
    if ( x > centerX - centerMargin && x < centerX + centerMargin) {
      this._swipe = {}
      this.setState({ swiped: false });
      return
    }
    this._swipe = { x: touch.clientX, y: touch.clientY };
    this.setState({ swiped: false });
  }

  _onTouchMove(e) {
    if (e.changedTouches && e.changedTouches.length) {
      //const touch = e.changedTouches[0];
      this._swipe.swiping = true;
    }
  }

  _onTouchEnd(e) {
    const touch = e.changedTouches[0];

    if( !this._swipe.swiping) {
      this.props.onTap && this.props.onTap(touch)
      return
    }
    const absX = Math.abs(touch.clientX - this._swipe.x);
    const absY = Math.abs(touch.clientY - this._swipe.y);
    // Don't swip if AbY is too high
    if(this._swipe.swiping && absY > 80) {
      this._swipe = {}
      return
    }

    if (this._swipe.swiping && absX > this.minDistance ) {
      this.props.onSwiped(true);
      this.setState({ swiped: true });
      if(touch.clientX < this._swipe.x) {
        // Swipe Right
        this.props.onSwipedRight && this.props.onSwipedRight();
      }
      if(touch.clientX > this._swipe.x) {
        // Swipe Left
        this.props.onSwipedLeft && this.props.onSwipedLeft();

      }
    }
    this._swipe = {};
  }

  render() {
    return (
      <div
        onTouchStart={this._onTouchStart}
        onTouchMove={this._onTouchMove}
        onTouchEnd={this._onTouchEnd}>
        { false ? `Component-${this.state.swiped ? 'swiped' : ''}` : null}
        {this.props.children}
      </div>
    );
  }

}
