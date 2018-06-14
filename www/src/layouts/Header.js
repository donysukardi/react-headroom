/* eslint-disable */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledHeader = styled.header`
  background: rgb(57, 111, 176);
  box-shadow: 1px 1px 1px rgba(0,0,0,0.25);
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  position: relative;
  transform: translateY(0);

  ${props => props.state !== 'unfixed' && `
    position: fixed;
    transition: all .2s ease-in-out;
  `}

  ${props => props.shouldHide && `
    transform: translateY(-100%)
  `}
`

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      state: props.state,
      shouldHide: props.state === 'unpinned',
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.state !== prevProps.state) {
      if (this.props.state === 'unpinned') {
        this.setState({
          shouldHide: true,
        }, () => {
          setTimeout(() => {
            this.setState({ state: 'unpinned' })
          }, 0)
        })
      } else {
        this.setState({
          shouldHide: false,
          state: this.props.state,
        })
      }
    }
  }

  render () {
    const { state, ...restProps } = this.props
    return (
      <StyledHeader
        {...restProps}
        state={this.state.state}
        shouldHide={this.state.shouldHide}
      />
    )
  }
}

Header.propTypes = {
  state: PropTypes.string.isRequired,
}

export default Header
/* eslint-enable */
