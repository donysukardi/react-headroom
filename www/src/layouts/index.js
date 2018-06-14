/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { Container } from 'react-responsive-grid'
import Header from './Header'
import { rhythm } from '../utils/typography'
import Headroom from '../../../src/index'

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
        {({ getRootProps, height, state }) => (
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
/* eslint-enable */
