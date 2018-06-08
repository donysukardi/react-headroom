import React, { Component } from 'react' // eslint-disable-line import/no-unresolved
import PropTypes from 'prop-types'
import shallowequal from 'shallowequal'
import raf from 'raf'
import Measure from 'react-measure'
import shouldUpdate from './shouldUpdate'

const noop = () => {}

export default class Headroom extends Component {
  static propTypes = {
    parent: PropTypes.func,
    children: PropTypes.any.isRequired,
    disable: PropTypes.bool,
    upTolerance: PropTypes.number,
    downTolerance: PropTypes.number,
    onPin: PropTypes.func,
    onUnpin: PropTypes.func,
    onUnfix: PropTypes.func,
    pinStart: PropTypes.number,
  };

  static defaultProps = {
    parent: () => window,
    disable: false,
    upTolerance: 5,
    downTolerance: 0,
    onPin: noop,
    onUnpin: noop,
    onUnfix: noop,
    pinStart: 0,
  };

  constructor (props) {
    super(props)
    // Class variables.
    this.currentScrollY = 0
    this.lastKnownScrollY = 0
    this.scrollTicking = false
    this.state = {
      state: 'unfixed',
      height: 0,
      shouldHide: false,
    }
  }

  componentDidMount () {
    if (!this.props.disable) {
      this.props.parent().addEventListener('scroll', this.handleScroll)
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (
      !shallowequal(this.props, nextProps) ||
      !shallowequal(this.state, nextState)
    )
  }

  componentDidUpdate (prevProps) {
    if (this.props.disable && !prevProps.disable) {
      this.unfix()
      this.props.parent().removeEventListener('scroll', this.handleScroll)
    } else if (!this.props.disable && prevProps.disable) {
      this.props.parent().addEventListener('scroll', this.handleScroll)
    }
  }

  componentWillUnmount () {
    this.props.parent().removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('scroll', this.handleScroll)
  }

  setRef = ref => (this.inner = ref)

  getScrollY = () => {
    if (this.props.parent().pageYOffset !== undefined) {
      return this.props.parent().pageYOffset
    } else if (this.props.parent().scrollTop !== undefined) {
      return this.props.parent().scrollTop
    } else {
      return (document.documentElement || document.body.parentNode || document.body).scrollTop
    }
  }

  getViewportHeight = () => (
    window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight
  )

  getDocumentHeight = () => {
    const body = document.body
    const documentElement = document.documentElement

    return Math.max(
      body.scrollHeight, documentElement.scrollHeight,
      body.offsetHeight, documentElement.offsetHeight,
      body.clientHeight, documentElement.clientHeight
    )
  }

  getElementPhysicalHeight = elm => Math.max(
    elm.offsetHeight,
    elm.clientHeight
  )

  getElementHeight = elm => Math.max(
    elm.scrollHeight,
    elm.offsetHeight,
    elm.clientHeight,
  )

  getScrollerPhysicalHeight = () => {
    const parent = this.props.parent()

    return (parent === window || parent === document.body)
      ? this.getViewportHeight()
      : this.getElementPhysicalHeight(parent)
  }

  getScrollerHeight = () => {
    const parent = this.props.parent()

    return (parent === window || parent === document.body)
      ? this.getDocumentHeight()
      : this.getElementHeight(parent)
  }

  isOutOfBound = (currentScrollY) => {
    const pastTop = currentScrollY < 0

    const scrollerPhysicalHeight = this.getScrollerPhysicalHeight()
    const scrollerHeight = this.getScrollerHeight()

    const pastBottom = currentScrollY + scrollerPhysicalHeight > scrollerHeight

    return pastTop || pastBottom
  }

  handleScroll = () => {
    if (!this.scrollTicking) {
      this.scrollTicking = true
      raf(this.update)
    }
  }

  unpin = () => {
    this.props.onUnpin()

    this.setState({
      shouldHide: true,
    }, () => {
      setTimeout(() => {
        this.setState({ state: 'unpinned' })
      }, 0)
    })
  }

  pin = () => {
    this.props.onPin()

    this.setState({
      shouldHide: false,
      state: 'pinned',
    })
  }

  unfix = () => {
    this.props.onUnfix()

    this.setState({
      shouldHide: false,
      state: 'unfixed',
    })
  }

  update = () => {
    this.currentScrollY = this.getScrollY()

    if (!this.isOutOfBound(this.currentScrollY)) {
      const { action } = shouldUpdate(
        this.lastKnownScrollY,
        this.currentScrollY,
        this.props,
        this.state
      )

      if (action === 'pin') {
        this.pin()
      } else if (action === 'unpin') {
        this.unpin()
      } else if (action === 'unfix') {
        this.unfix()
      }
    }

    this.lastKnownScrollY = this.currentScrollY
    this.scrollTicking = false
  }

  render () {
    const { children } = this.props

    return (
      <Measure
        bounds
        onResize={(contentRect) => {
          this.setState({ height: contentRect.bounds.height })
        }}
      >
        {({ measureRef }) => children({
          getRootProps: ({ refKey = 'ref' } = {}) => ({
            [refKey]: (ref) => {
              measureRef(ref)
              this.setRef(ref)
            },
          }),
          ...this.state,
        })}
      </Measure>
    )
  }
}
