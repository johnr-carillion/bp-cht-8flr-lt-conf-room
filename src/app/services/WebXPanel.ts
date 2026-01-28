import { Injectable, NgZone } from '@angular/core';

/** Crestron Web XPanel Import */
import { getWebXPanel, runsInContainerApp } from '@crestron/ch5-webxpanel';

const { isActive, WebXPanel, WebXPanelConfigParams, WebXPanelEvents, getVersion, getBuildDate } =
  getWebXPanel(!runsInContainerApp());

// Log the version and build date of the WebXPanel to the console.
console.log(`Crestron WebXPanel version: ${getVersion()}`);
console.log(`Crestron WebXPanel build date: ${getBuildDate()}`);

@Injectable({
  providedIn: 'root',
})
export class WebXPanelService {
  constructor(private ngZone: NgZone) {
    // Add an event listener to the WebXPanel to listen for the NOT_AUTHORIZED event.
    WebXPanel.addEventListener(WebXPanelEvents.NOT_AUTHORIZED, ({ detail }: any) => {
      // If the WebXPanel is not authorized, log the reason to the console and redirect to the URL provided in the detail.
      console.log('Crestron WebXPanel Not authorized: ', detail);
      // Redirect to the URL provided in the detail.
      window.location.href = detail.redirectTo;
    });

    WebXPanel.addEventListener(WebXPanelEvents.CONNECT_CIP, ({ detail }: any) => {
      const { url, ipId, roomId } = detail;
      console.log(`Connected to ${url}, 0x${ipId.toString(16).padStart(2, '0')}, ${roomId}`);
    });

    WebXPanel.addEventListener(WebXPanelEvents.DISCONNECT_CIP, ({ detail }: any) => {
      const { reason } = detail;
      console.log(`Disconnected from CIP. Reason: ${reason}`);
    });

    WebXPanel.addEventListener(WebXPanelEvents.ERROR_WS, ({ detail }: any) => {
      const { reason } = detail;
      console.log(`Websocket Error: ${reason}`);
    });

    if (isActive) {
      // Get the query parameters from the URL.
      var entries = this.GetQueryParameters();
      // Set the WebXPanelConfigParams based on the query parameters.
      // If the query parameters are not set, the default values will be used.
      //WebXPanelConfigParams.host = entries['host'] ?? 'window.location.hostname';// should be window.location.hostname once we are installed on the processor;
      // WebXPanelConfigParams.host = entries['host'] ?? 'https://192.168.1.1/'; // Site IP
      WebXPanelConfigParams.host = entries['host'] ?? 'https://192.168.0.31/'; // John IP
      // Adding toLowerCase to ensure that if the IPID is entered accidentally as 0X00 rather than 0x00 it will still work.
      WebXPanelConfigParams.ipId = (entries['ipid'] ?? '0x13').toLowerCase();
      WebXPanelConfigParams.port = entries['port'] ?? 49200;
      //  WebXPanelConfigParams.roomId = entries['roomid'] ?? 'MPC3201B';
      // WebXPanelConfigParams.tokenSource = entries['tokensource'];
      // WebXPanelConfigParams.tokenUrl =
      //   entries['tokenurl'] ||
      //   `https://192.168.0.50/cws/websocket/getWebSocketToken`;
      // WebXPanelConfigParams.authToken = entries['authtoken'] ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsIlNvdXJjZSI6IkNvbnRyb2wgU3lzdGVtIn0.eyJleHAiOjE3NTA4NDkzNDEsInVzZXJuYW1lIjoiVG9rZW4iLCJPcHRpb25hbCI6IjE1NDQ5NjE1MzAifQ.da6-Wlj6b04SdnhpzhCTECaBmW9OmBKYN9zz1odIHeY'; //Site Processor
      WebXPanelConfigParams.authToken =
        entries['authtoken'] ??
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsIlNvdXJjZSI6IkNvbnRyb2wgU3lzdGVtIn0.eyJleHAiOjE3MjEwNjEyNTgsInVzZXJuYW1lIjoiT2ZmbGluZVRva2VuIiwiT3B0aW9uYWwiOiIyNTI4MDc4NiJ9.8HDWKEdISJEWcQYhNN5PnBDqZWiuvtDxEbsI9y4hf9c'; //JohnR processor
      console.log('Crestron WebXPanelConfigParams: ' + JSON.stringify(WebXPanelConfigParams));
      this.ngZone.runOutsideAngular(() => WebXPanel.initialize(WebXPanelConfigParams));
    }
  }

  /** Gets the query parameters from the URL */
  GetQueryParameters() {
    // Get the url of the window location.
    var url = new URL(window.location.href);
    // Get the search parameters from the URL.
    var urlParameters: any = new URLSearchParams(url.search);
    var queries: any = {};
    for (var [key, value] of urlParameters) {
      queries[key.toLowerCase()] = value;
    }
    return queries;
  }
}
