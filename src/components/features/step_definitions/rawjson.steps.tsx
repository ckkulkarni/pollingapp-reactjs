import axios from "axios";
import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom/extend-expect";
import { loadFeature, defineFeature } from "jest-cucumber";
import RawJSON from "./../../RawJSON";
const feature = loadFeature("src/components/features/rawjson.feature");
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
  test("User can view the raw JSON data for a story", ({
    given,
    and,
    then,
  }) => {
    const location = {
      state: {
        hit: {
          url: "https://example1.com",
          title: "Title 1",
          created_at: "19-03-2023",
          author: "John Marston",
          objectID: "001",
        },
      },
      pathname: "/details",
    };
    const screen = render(
      <MemoryRouter initialEntries={[location]}>
        <RawJSON />
      </MemoryRouter>
    );

    given("a user is on the Raw JSON page for a story", () => {
      expect(screen).toBeDefined();
    });

    then("the user should see the raw JSON data for the story", () => {
      const rawJson = screen.getByTestId("raw-json");
      const expectedObject = JSON.parse(rawJson.innerHTML);
      expect(expectedObject.url).toEqual(location.state.hit.url);
      expect(expectedObject.created_at).toEqual(location.state.hit.created_at);
      expect(expectedObject.objectID).toEqual(location.state.hit.objectID);
      expect(expectedObject.author).toEqual(location.state.hit.author);
      expect(expectedObject.title).toEqual(location.state.hit.title);
    });
  });
});
