import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { Room } from './components/ChatRoom'
import MainPage from './components/MainPage'

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={MainPage} />
        <Route exact path='/room/:roomId' component={Room} />
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </BrowserRouter>
  )
}


