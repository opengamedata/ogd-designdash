import React from 'react'

export class ErrorBoundary extends React.Component {
   constructor(props) {
      super(props);
      this.state = { hasError: false };
   }

   static getDerivedStateFromError(error) {    // Update state so the next render will show the fallback UI.
      return { hasError: true };
   }

   componentDidCatch(error, errorInfo) {    // You can also log the error to an error reporting service
      console.error(`Got error ${errorInfo.toString()}, with the following error message:\n${error}`);
   }

   render() {
      if (this.state.hasError) {      // You can render any custom fallback UI
         return <h1>Error in child component of type {this.props.childName}</h1>;
      }
      return this.props.children;
   }
}