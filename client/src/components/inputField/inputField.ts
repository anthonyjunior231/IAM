// input container styles
import styled from "styled-components";

export const InputContainer = styled.div`
  .input__container {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    width: 100%;
    position: relative;

    &__div {
      position: relative;
      display: flex;
      gap: 0.2em;

      // input styles
      &__input {
        padding: 0.8rem 0.5em;

        width: 100%;
        box-sizing: border-box;

        background-color: #f2f2f2;
        border-radius: 0.5rem;
        border: 1px solid transparent;
        color: var(--secondary-text-color);
        font-size: 0.9em;
        outline: none;

        // effects styles
        &:hover,
        &:active,
        &:focus-visible,
        &:focus {
          box-shadow: none;
          border: 1px solid var(--outline-color);
          color: var(--secondary-text-color);
          background-color: white;
        }
      }

      &__input__icon {
        width: 1.25rem;
        height: 1.25rem;
        margin: auto -2rem;
        cursor: pointer;
      }
    }

    // label styles
    &__label {
      color: var(--secondary-text-color);
      font-size: 0.9em;
      font-weight: 500;
    }

    &__div__error {
      color: red;
      font-size: 0.75rem;
      font-weight: 200;

      @media screen and (max-width: 534px) {
        font-size: 0.65rem;
      }
    }
  }
`;
