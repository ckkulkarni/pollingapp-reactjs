import axios from "axios";
import React from "react";
import {
  render,
  waitFor,
  fireEvent,
  RenderResult,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import StoryList from "../../StoryList";
import "@testing-library/jest-dom/extend-expect";
import { loadFeature, defineFeature } from "jest-cucumber";
import { act } from "react-dom/test-utils";
import RawJSON from "./../../RawJSON";
import * as router from "react-router";
const feature = loadFeature("src/components/features/storylist.feature");
jest.mock("axios");
class MockIntersectionObserver implements IntersectionObserver {
  root!: Element | Document | null;
  rootMargin!: string;
  thresholds!: readonly number[];
  takeRecords(): IntersectionObserverEntry[] {
    throw new Error("Method not implemented.");
  }
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

global.IntersectionObserver = MockIntersectionObserver;

defineFeature(feature, (test) => {
  let screen: any;
  test("User can view a list of stories", ({ given, when, then, and }) => {
    given("a user is on the home page", () => {
      jest.mock("axios");
      const post1 = {
        url: "https://example1.com",
        title: "Title 1",
        created_at: "19-03-2023",
        author: "John Marston",
        objectID: "001",
      };
      const post2 = {
        url: "https://example2.com",
        title: "Title 2",
        created_at: "20-03-2023",
        author: "Jane Marston",
        objectID: "002",
      };
      const post3 = {
        url: "https://example3.com",
        title: "Title 3",
        created_at: "20-03-2023",
        author: "Jack Marston",
        objectID: "003",
      };

      (axios.get as jest.Mock).mockResolvedValueOnce({
        data: {
          hits: [post1, post2, post3],
        },
      });

      screen = render(
        <MemoryRouter>
          <StoryList />
        </MemoryRouter>
      );
    });

    when("the user visits the Story List component", () => {
      expect(screen).toBeDefined();
    });

    then(
      'the user should see a table with columns "Title", "URL", "Author", and "Created At"',
      () => {
        const tableHeaders = screen.getAllByTestId("tableHeader");
        expect(tableHeaders[0]).toHaveTextContent("Title");
        expect(tableHeaders[1]).toHaveTextContent("URL");
        expect(tableHeaders[2]).toHaveTextContent("Author");
        expect(tableHeaders[3]).toHaveTextContent("Created At");
      }
    );
    and("the table should have multiple rows of stories", async () => {
      await waitFor(() => {
        const tableRows = screen.getAllByTestId("tableRow");
        expect(tableRows.length).toBeGreaterThan(1);
      });
    });
  });
  test("User can navigate to a story", ({ given, then, when, and }) => {
    const navigate = jest.fn();
    beforeEach(() => {
      jest.spyOn(router, "useNavigate").mockImplementation(() => navigate);
    });

    given("a user is on the home page", () => {
      jest.mock("axios");
      const post1 = {
        url: "https://example1.com",
        title: "Title 1",
        created_at: "19-03-2023",
        author: "John Marston",
        objectID: "001",
      };
      const post2 = {
        url: "https://example2.com",
        title: "Title 2",
        created_at: "20-03-2023",
        author: "Jane Marston",
        objectID: "002",
      };
      const post3 = {
        url: "https://example3.com",
        title: "Title 3",
        created_at: "20-03-2023",
        author: "Jack Marston",
        objectID: "003",
      };

      (axios.get as jest.Mock).mockResolvedValueOnce({
        data: {
          hits: [post1, post2, post3],
        },
      });
      screen = render(
        <MemoryRouter>
          <StoryList />
        </MemoryRouter>
      );
    });
    when("the user clicks on a story in the Story List", async () => {
      await waitFor(() => {
        const stories = screen.getAllByTestId("storyRow");
        act(() => {
          fireEvent.click(stories[0]);
        });
      });
    });

    then(
      "the user should be navigated to the story page with the corresponding story details",
      () => {
        const state = {
          hit: {
            author: "John Marston",
            created_at: "19-03-2023",
            objectID: "001",
            title: "Title 1",
            url: "https://example1.com",
          },
        };
        expect(navigate).toHaveBeenCalledWith("/story", { state });
      }
    );
  });
  test("Story List updates automatically", ({ given, when, then, and }) => {
    beforeEach(() => {
      jest.useFakeTimers();
    });
    afterEach(() => {
      jest.useRealTimers();
    });
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    given("a user is on the home page", () => {
      jest.mock("axios");
      const post1 = {
        url: "https://example1.com",
        title: "Title 1",
        created_at: "19-03-2023",
        author: "John Marston",
        objectID: "001",
      };
      const post2 = {
        url: "https://example2.com",
        title: "Title 2",
        created_at: "20-03-2023",
        author: "Jane Marston",
        objectID: "002",
      };

      (axios.get as jest.Mock)
        .mockResolvedValueOnce({
          data: {
            hits: [post1, post2],
          },
        })
        .mockResolvedValueOnce({
          data: {
            hits: [post1, post2, post1, post2],
          },
        });
      screen = render(
        <MemoryRouter>
          <StoryList />
        </MemoryRouter>
      );
    });

    when("the user visits the Story List component", () => {
      expect(screen).toBeDefined();
    });

    then(
      "the component should automatically update the list every 10 seconds",
      async () => {
        jest.mock("axios");
        const mockedAxios = axios as jest.Mocked<typeof axios>;
        const mockedResponse = {
          data: {
            hits: [
              {
                title: "Title 1",
                url: "www.exampleURL1.com",
                author: "John Marston",
                created_at: "20-03-2023",
                objectID: "1",
              },
              {
                title: "Title 2",
                url: "www.exampleURL2.com",
                author: "test author 3",
                created_at: "19-03-2023",
                objectID: "2",
              },
            ],
          },
        };
        mockedAxios.get.mockResolvedValue(mockedResponse);
        jest.useFakeTimers();
        const { findAllByTestId } = render(<StoryList />);
        await findAllByTestId("storyRow");
        expect(mockedAxios.get).toHaveBeenCalled();
        jest.advanceTimersByTime(10000);
        expect(mockedAxios.get).toHaveBeenCalled();
        jest.advanceTimersByTime(10000);
        expect(mockedAxios.get).toHaveBeenCalled();
        jest.useRealTimers();
      }
    );
  });
});
