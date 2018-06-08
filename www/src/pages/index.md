---
path: "/"
---

[Code on Github](https://github.com/KyleAMathews/react-headroom)

React Headroom is a React Component to hide/show your header on scroll. The header on this site is a living example. When you scroll down, it slides out of view and slides back in when scrolling up.

Fixed headers are nice for persistent navigation but they can also get in the way by taking up valuable vertical screen space. Using this component lets you have your persistent navigation while preserving screen space when the navigation is not needed.

## Install

`npm install react-headroom`

## Using React Headroom

It's very simple actually :)

Here's an example:

```javascript
<Headroom>
  {({ getRootProps, height, state, shouldHide }) => (
    <div style={{
      height,
    }}>
      <header
        {...getRootProps()}
        style={{
          background: 'rgb(57, 111, 176)',
          boxShadow: '1px 1px 1px rgba(0,0,0,0.25)',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1,
          position: 'relative',
          transform: 'translateY(0)',
          ...(shouldHide ? {
            transform: 'translateY(-100%)',
          } : {}),
          ...(state !== 'unfixed' ? {
            position: 'fixed',
            transition: 'all .2s ease-in-out',
          } : {
          }),
        }}
      >
        <h1>You can put anything you'd like inside the Headroom Component</h1>
      </header>
    </div>
  )}
</Headroom>
```

Another example using `styled-components`:

```javascript

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

<Headroom>
  {({ getRootProps, height, state, shouldHide }) => (
    <div style={{
      height,
    }}>
      <Header
        {...getRootProps({
          refKey: 'innerRef',
        })}
        state={state}
        shouldHide={shouldHide}
      >
        <h1>You can put anything you'd like inside the Headroom Component</h1>
      </Header>
    </div>
  )}
</Headroom>
```

[See the code for this website.](https://github.com/KyleAMathews/react-headroom/blob/master/www/src/layouts/index.js)

### Other props

*   `onPin` — callback called when header is pinned
*   `onUnpin` — callback called when header is unpinned
*   `onUnfix` — callback called when header position is no longer fixed
*   `upTolerance` — scroll tolerance in px when scrolling up before component is pinned
*   `downTolerance` — scroll tolerance in px when scrolling down before component is pinned
*   `disable` — disable pinning and unpinning
*   `parent` — provide a custom 'parent' element for scroll events. `parent` should be a function which resolves to the desired element.
*   `pinStart` — height in px where the header should start and stop pinning. Useful when you have another element above Headroom component.
