Feature: StoryList component

    Scenario: User can view a list of stories
        Given a user is on the home page
        When the user visits the Story List component
        Then the user should see a table with columns "Title", "URL", "Author", and "Created At"
        And the table should have multiple rows of stories

    Scenario: User can navigate to a story
        Given a user is on the home page
        When the user clicks on a story in the Story List
        Then the user should be navigated to the story page with the corresponding story details

    Scenario: Story List updates automatically
        Given a user is on the home page
        When the user visits the Story List component
        Then the component should automatically update the list every 10 seconds
