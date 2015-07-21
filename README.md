# AMS Lens

## Install


1. Clone the `AMS-Lens` repository

  ```bash
  $ git clone https://github.com/AmerMathSoc/AMS-Lens.git
  ```

2. Fetch dependencies

  ```bash
  $ cd AMS-Lens
  $ npm install
  ```

3. Run the server

  ```bash
  $ npm start
  Lens running on port 4001
  http://127.0.0.1:4001/
  ```

With this work AMS provides extensions for the Lens reader to display JATS files
with Math content, i.e. environments and formulas.

## Visualization

Basically there are two important areas, the content panel displaying the article body, and the math panel showing math environments. In addition to math environments there are inline-formulas, display-formulas, and references to any of these.

In the content panel everthing is rendered in the common document flow.

Math environments consist of a title, a comment, and a body which if possible is started on the same line as the title.

![image](https://cloud.githubusercontent.com/assets/284099/5183173/d21e2a20-74ab-11e4-8893-a7e3f6884b5f.png)

A bracket is used to denote the range of the theorem for better distinction from
common content. Additionally the bracket is used as a place for hihglighting and triggering user interaction.

Proofs are rendered in a rather conventional way, with a terminating q.e.d. symbol.

![image](https://cloud.githubusercontent.com/assets/284099/5183286/7992bcb6-74ad-11e4-941a-9cd23dd48b57.png)

The math panel (on the righthand side) is used to show math content side-by-side with the articles text, e.g., to make it easier to follow a narrative containing a reference to a theorem.

![image](https://cloud.githubusercontent.com/assets/284099/5183277/454506e4-74ad-11e4-9e6c-e285ae63923e.png)

> At the moment, all environments are added to the math panel, and labeled display-formulas not being part of an environment which are referenced in the text.

Highlights are used to show all related resources (environments, references).

![image](https://cloud.githubusercontent.com/assets/284099/5183294/a6f44062-74ad-11e4-987a-b3159a0200c5.png)

The scrollbar shows every related resource. To allow easy spotting of the original occurrence of an environment (or formula), a different styling is used for the highlight. This follows the basic idea of the Lens interface, that everything which is possibly referenced should be provided in a resource panel to allow side-by-side reading.

## Interaction

There are several different scenarios how to interact with the math related content in Lens. The following describes in what actions are taken in the various cases.

1. Click on a reference in the content panel:

  1. open the math panel and scroll to the referenced resource
  2. highlight all related resources and references in the content panel
  3. emphasize the original occurrence of the referenced resource
  4. highlight the resource in the math panel (to pinpoint the location of
     the currently focussed resource)

2. Click on the header of a math resource within the math panel

  1.2 - 1.4

3. Click on the bracket of a math resource within the content panel

  1.2 - 1.4

Generally, we avoid to change the scroll position within the content panel implicitly to preserve the current reading position.
