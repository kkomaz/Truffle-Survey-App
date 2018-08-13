import React, { Component } from 'react';
import { AlertList } from 'react-bs-notifier';
import headlinerFilter from './headlinerFilter';

export default function (ComposedComponent) {
  class Notifier extends Component {
    state = {
      alerts: [],
    };

    onAlertDismissed = (alert) => {
      const { alerts } = this.state;

      // find the index of the alert that was dismissed
      const idx = alerts.indexOf(alert);

      if (idx >= 0) {
        this.setState({
          // remove the alert from the array
          alerts: [...alerts.slice(0, idx), ...alerts.slice(idx + 1)],
        });
      }
    }

    generate = (type, message) => {
      const newAlert = {
        id: (new Date()).getTime(),
        type,
        headline: headlinerFilter(type),
        message,
      };

      this.setState(prevState => ({
        alerts: [...prevState.alerts, newAlert],
      }));
    }

    render() {
      return (
        <React.Fragment>
          <ComposedComponent {...this.props} generate={this.generate} />
          <AlertList
            position="bottom-right"
            alerts={this.state.alerts}
            timeout={3000}
            dismissTitle="ainBegone!"
            onDismiss={this.onAlertDismissed}
          />
        </React.Fragment>
      );
    }
  }

  return Notifier;
}
