# Nested Schema Table

This basic React app boasts a lovely nested schema table. It takes in two sets of data of the same shape, compares them, and renders the contents in an expandable table.

If a row belongs in dataset A but not in dataset B, it will be highlighted in green. If it belongs in dataset B but not in dataset A, it will be highlighted red. The default state of this table is to open up to show differing data between the two sets. Finally, if the row belongs in both sets of data, use the fields from dataset A over dataset B.

## Get up and running

In order to run this app locally, you simply need to install dependencies and then start the development server.

Run the following:

`yarn install`

`yarn start`

## Testing

I decided to use Enzyme as the testing framework for this app. In order to see test results, run:

`yarn test`
