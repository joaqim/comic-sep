import React, { Component } from "react";
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  InfiniteLoader,
  List,
  WindowScroller
} from "react-virtualized";

const cache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 100
});

class LabelList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollToIndex: -1,
      list: props.list
    };
    this.handleClick = this.handleClick.bind(this);
    this.loadMoreRows = this.loadMoreRows.bind(this);
    this.isRowLoaded = this.isRowLoaded.bind(this);
    this.clearScrollToIndex = this.clearScrollToIndex.bind(this);
  }

  clearScrollToIndex() {
    this.setState({ scrollToIndex: -1 });
  }

  handleClick() {
    this.setState({
      scrollToIndex: Number(this.inputRow.value)
    });
  }

  isRowLoaded({ index }) {
    const { list } = this.state;
    return !!list[index];
  }

  loadMoreRows({ startIndex, stopIndex }) {
    console.log("load more", startIndex, stopIndex);
  }

  rowRenderer({ index, isScrolling, isVisible, key, parent, style }) {
    if (isScrolling) {
      return null;
    }

    if (isVisible) {
      return (
        <CellMeasurer
          key={key}
          cache={cache}
          parent={parent}
          columnIndex={0}
          rowIndex={index}
        >
          <div style={style}>this is row: {index}</div>
        </CellMeasurer>
      );
    }
    return null;
  }

  render() {
    if (this.state.list.length === 0) {
      return <div>No data available.</div>;
    }

    const scrollToIndex = this.state.scrollToIndex;

    return (
      <div>
        <div>
          <input
            type="number"
            ref={input => {
              this.inputRow = input;
            }}
          />
          <input
            type="button"
            value="Scroll To Row"
            onClick={this.handleClick}
          />
        </div>
        <InfiniteLoader
          isRowLoaded={this.isRowLoaded}
          loadMoreRows={loadMoreRows => this.loadMoreRows(loadMoreRows)}
          rowCount={2000}
          threshold={15}
        >
          {({ onRowsRendered, registerChild }) => (
            <WindowScroller onScroll={this.clearScrollToIndex}>
              {({ height, isScrolling, onChildScroll, scrollTop }) => (
                <AutoSizer disableHeight>
                  {({ width }) => {
                    console.log("scroll to index", scrollToIndex);
                    return (
                      <List
                        autoHeight
                        height={height}
                        onRowsRendered={onRowsRendered}
                        ref={registerChild}
                        width={width}
                        rowCount={2000}
                        rowHeight={cache.rowHeight}
                        rowRenderer={rowRenderer =>
                          this.rowRenderer(rowRenderer)
                        }
                        scrollTop={scrollTop}
                        deferredMeasurementCache={cache}
                        style={{ paddingLeft: "0", paddingRight: "0" }}
                        scrollToAlignment="start"
                        scrollToIndex={scrollToIndex}
                        onScroll={onChildScroll}
                      />
                    );
                  }}
                </AutoSizer>
              )}
            </WindowScroller>
          )}
        </InfiniteLoader>
      </div>
    );
  }
}

export default LabelList;
