import { act, screen } from '@testing-library/react';
import { render, unmountComponentAtNode } from 'react-dom';
import App from './App';

/**
 * @jest-environment jsdom
 */
let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("Shows a loading message on initial render", () => {
  render(<App />, container);
  const loadingMessage = screen.getByText('Loading...');
  expect(loadingMessage).toBeInTheDocument();
})

it("Renders a chart and a table after an API call", async () => {
  const fakeRes = {
    "count": 1,
	  "next": null,
	  "previous": null,
	  "results": [{
      "name": "Tatooine",
			"rotation_period": "23",
			"orbital_period": "304",
			"diameter": "10465",
			"climate": "arid",
			"gravity": "1 standard",
			"terrain": "desert",
			"surface_water": "1",
			"population": "200000",
    }]
  }
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeRes)
    })
  );
  await act(async () => {
    render(<App />, container);
  });
  expect(container.querySelector('.Charts')).toBeTruthy();
  expect(container.querySelector('.Population-chart')).toBeTruthy();
  expect(container.querySelector('table')).toBeTruthy();

  global.fetch.mockRestore();
})

it("Shows an error message if API call fails", async () => {
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      ok: false,
      json: () => {}
    })
  );
  await act(async () => {
    render(<App />, container);
  });
  const errorMessage = screen.getByText('Something went wrong, please try refreshing!');
  expect(errorMessage).toBeInTheDocument();

  global.fetch.mockRestore();
})

it("Next 10 / Previous 10 buttons work as expected", async() => {
  const fakeRes = {
    "count": 11,
	  "next": null,
	  "previous": null,
	  "results": [
      {"name": "Tatooine",},
      {"name": "Alderaan",},
      {"name": "Dathomir",},
      {"name": "Some",},
      {"name": "Other",},
      {"name": "Planets",},
      {"name": "Because I'm",},
      {"name": "A fake",},
      {"name": "Geek",},
      {"name": "Idk anything",},
      {"name": "About sw deep lore",},
    ]
  }
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeRes)
    })
  );
  await act(async () => {
    render(<App />, container);
  });
  const prevButton = document.querySelector('.Prev-ten');
  const nextButton = document.querySelector('.Next-ten');
  let trs = document.getElementsByTagName('tr');
  expect(prevButton.innerHTML).toBe("Previous 10 planets");
  expect(nextButton.innerHTML).toBe("Next 10 planets");
  expect(prevButton.disabled).toBe(true);
  expect(nextButton.disabled).toBe(false);
  expect(trs).toHaveLength(11);
  //clicky da next button
  act(() => {
    nextButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  trs = document.getElementsByTagName('tr');
  expect(trs).toHaveLength(2);
  expect(nextButton.disabled).toBe(true);
  expect(prevButton.disabled).toBe(false);
  //clicky da prev button
  act(() => {
    prevButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  trs = document.getElementsByTagName('tr');
  expect(trs).toHaveLength(11);
  expect(prevButton.disabled).toBe(true);
  expect(nextButton.disabled).toBe(false);
})

// The following test is commented out because it is a test that is useful to have,
// but plotly doesn't seem to update properly in the test suite, and so I'm not sure
// how to get it working.

// it("Updates the chart when a table header is clicked", async() => {
//   const fakeRes = {
//     "count": 1,
// 	  "next": null,
// 	  "previous": null,
// 	  "results": [{
//       "name": "Tatooine",
// 			"rotation_period": "23",
// 			"orbital_period": "304",
// 			"diameter": "10465",
// 			"climate": "arid",
// 			"gravity": "1 standard",
// 			"terrain": "desert",
// 			"surface_water": "1",
// 			"population": "200000",
//     }]
//   }
//   jest.spyOn(global, "fetch").mockImplementation(() =>
//     Promise.resolve({
//       json: () => Promise.resolve(fakeRes)
//     })
//   );
//   await act(async () => {
//     render(<App />, container);
//   });
//   let ths = document.getElementsByTagName('th');
//   for (let header of ths) {
//     act(() => {
//       header.dispatchEvent(new MouseEvent('click', {bubbles: true}));
//     })
//     let attribute = header.innerHTML;
//     let chartTitle = document.querySelector('.gtitle').innerHTML;
//     expect(chartTitle).toBe(`${attribute} of Star Wars Planets`);
//   }
// })