# Southeast Asia Payment Landscape

This project provides an interactive dashboard to explore and compare payment gateways available across various Southeast Asian countries.

![Dynamic Banner](./public/images/sea-default.jpg) <!-- Consider replacing with a more general screenshot -->

## Features

*   **Dynamic Country Selection:** View payment gateways specific to Singapore, Malaysia, Indonesia, Thailand, Vietnam, and the Philippines.
*   **Dynamic Banner:** Displays relevant imagery for the selected country or region.
*   **Gateway Filtering:** Filter payment gateways based on country, payment methods, integration complexity, and fee ranges.
*   **Gateway Comparison:** Select multiple gateways to compare their features side-by-side.
*   **Search Functionality:** Quickly find specific payment gateways.
*   **Responsive Design:** Adapts to different screen sizes.

## Technologies Used

*   **Framework:** [Next.js](https://nextjs.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
*   **State Management:** [Zustand](https://github.com/pmndrs/zustand)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (Version 18.x or later recommended)
*   [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/jaykopm/codezero.jk.git
    cd payment-landscape
    ```
2.  **Install dependencies:**
    Using npm:
    ```bash
    npm install
    ```
    Or using pnpm:
    ```bash
    pnpm install
    ```

### Running Locally

Start the development server:

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) (or the next available port if 3000 is busy) with your browser to see the result.

## Project Structure

```
payment-landscape/
├── app/             # Next.js App Router pages
├── components/      # Reusable UI components (application-specific & shadcn/ui)
├── hooks/           # Custom React hooks
├── lib/             # Utility functions, data definitions, state management
├── public/          # Static assets (images, logos)
├── styles/          # Global styles
├── .env.local       # Local environment variables (not committed)
├── .gitignore       # Files ignored by Git
├── next.config.mjs  # Next.js configuration
├── package.json     # Project dependencies and scripts
├── README.md        # This file
├── tailwind.config.ts # Tailwind CSS configuration
└── tsconfig.json    # TypeScript configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is currently unlicensed. Consider adding an open-source license like MIT if you intend for others to use or contribute to your code.