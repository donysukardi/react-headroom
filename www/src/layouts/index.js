import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components';
import Helmet from 'react-helmet'
import { Container } from 'react-responsive-grid'

import { rhythm } from '../utils/typography'
import Headroom from '../../../src/index'

const Header = styled.header`
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

const Layout = ({ data }) => (
  <div>
    <Helmet
      title={data.site.siteMetadata.title}
    />
    <div style={{ marginBottom: rhythm(1) }}>
      <Headroom
        onUnfix={() => console.log('unfixed')}
        onPin={() => console.log('pinned')}
        onUnpin={() => console.log('unpinned')}
      >
        {({ getRootProps, height, state, shouldHide }) => (
          <div
            style={{
              height,
              marginBottom: rhythm(1),
            }}
          >
            <Header
              {...getRootProps({
                refKey: 'innerRef',
              })}
              state={state}
              shouldHide={shouldHide}
            >
              <Container style={{ maxWidth: 960, padding: `${rhythm(1/2)}` }}>
                <h1
                  style={{
                    margin: 0,
                    color: 'rgb(252, 253, 254)',
                  }}
                >
                  React Headroom
                </h1>
              </Container>
            </Header>
          </div>
        )}
      </Headroom>
      <Container
        style={{
          maxWidth: 960,
          padding: `${rhythm(1)} ${rhythm(1/2)}`,
          paddingTop: 0,
        }}
      >
        <div dangerouslySetInnerHTML=
          {{
            __html: data.allMarkdownRemark.edges[0].node.html,
          }}
        />
      </Container>
    </div>
  </div>
)

Layout.propTypes = {
  children: PropTypes.func,
}

export default Layout

export const query = graphql`
  query PageQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(limit: 1) {
      edges{
        node{
          html
        }
      }
    }
  }
`
