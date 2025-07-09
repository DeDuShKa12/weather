import { render, screen, fireEvent } from "@testing-library/react";

import { Modal } from "../src/components/Modal";

describe("Modal", () => {
  it("renders children and closes on close button click", () => {
    const onClose = jest.fn();

    render(
      <Modal onClose={onClose}>
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.getByText("Modal content")).toBeInTheDocument();

    fireEvent.click(screen.getByText("×"));
    expect(onClose).toHaveBeenCalled();
  });

  it("closes when clicking on backdrop", () => {
    const onClose = jest.fn();

    const { container } = render(
      <Modal onClose={onClose}>
        <p>Modal content</p>
      </Modal>
    );

    fireEvent.click(container.firstChild as HTMLElement);
    expect(onClose).toHaveBeenCalled();
  });
});
