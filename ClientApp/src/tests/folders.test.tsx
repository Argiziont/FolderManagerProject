import React from "react";
import Adapter from "enzyme-adapter-react-16";
import user from "@testing-library/user-event";
import { unmountComponentAtNode, render } from "react-dom";
import { act } from "react-dom/test-utils";
import "mutationobserver-shim";
global.MutationObserver = window.MutationObserver;
import { configure, mount } from "enzyme";
import { Button, TextField } from "@material-ui/core";

import { FoldersTable } from "../FolderPage/FoldersTable";
import { IFolder } from "../helpers/IFolder";
import { FilesList, FolderManagmentForm, InteractiveList } from "../components";
import { SignInPage } from "../LoginForm";

//Arrange
let container: HTMLDivElement | null = null;
const folders: IFolder[] = [
  {
    filesIds: [7, 26, 33, 35],
    filesNames: [
      "2019-08-05 23-30-35.flv",
      "7fa801e7ea87c8.mp3",
      "Eluveitie_-_Alesia.mp3",
      "Eluveitie_-_Nil.mp3",
    ],
    folderId: 2,
    folderName: "Music",
  },
  {
    filesIds: [57, 58, 59, 60, 94],
    filesNames: [
      "003bdb1b7e9a36fea4fb2cfc257c146f.jpg",
      "0acf876929b671b98f1fcae527070b24.jpg",
      "0a48de931313d6766a2b5d2f70441954.jpg",
      "00a04e2da630831e58cc680be7f72bd2.jpg",
      "Юрій-Яновський-1902—1954.-Біографія-2.jpg",
    ],
    folderId: 99,
    folderName: "Photo",
  },
];
const file = new File(["TEST IMAGE"], "test.png", { type: "image/png" });

configure({ adapter: new Adapter() });

beforeEach(() => {
  // подготавливаем DOM-элемент, куда будем рендерить
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // подчищаем после завершения
  if (container) {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  }
});
describe("Folders and files display test", () => {
  it("Names of files and folders must be exact as expected", () => {
    //Testing folders names
    act(() => {
      render(<FoldersTable folders={folders} />, container);
    });
    expect(container?.childNodes[0].textContent).toBe("MusicPhoto");

    //Testing files names
    act(() => {
      render(
        <FilesList
          FilesIdsArray={folders[0].filesIds}
          FilesNamesArray={folders[0].filesNames}
        />,
        container
      );
    });

    expect(container?.childNodes[0].textContent?.length).toBeGreaterThan(0);
  });

  it("Delete handler must be defined and called", () => {
    const onDelete = jest.fn();

    act(() => {
      render(
        <InteractiveList folder={folders[0]} DeleteHandler={onDelete} />,
        container
      );
    });
    //Create button ref
    const button = document.querySelector(
      "[data-testid=delete]"
    ) as HTMLButtonElement;
    expect(button?.innerHTML).not.toBeFalsy();

    //Simulate button 10 times

    for (let i = 0; i < 10; i++) {
      user.click(button);
    }
    //deprecated click simulation

    // act(() => {
    //   for (let i = 0; i < 10; i++) {
    //     button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    //   }
    // });

    //Simulate buutton click 9 more times
    expect(onDelete).toHaveBeenCalledTimes(10);
  });

  it("Input must get and process file", () => {
    const onSnack = jest.fn((noti: string[]) => {
      expect(noti[0]).not.toBeFalsy();
    });
    const fileinput = document.querySelector(
      "[data-testid=upload]"
    ) as HTMLInputElement;
    act(() => {
      render(
        <InteractiveList folder={folders[0]} SnackCallback={onSnack} />,
        container
      );
      fileinput && user.upload(fileinput, file);
    });
    //Create button ref

    fileinput?.files && expect(fileinput?.files[0]).toStrictEqual(file);

    fileinput?.files && expect(fileinput?.files[0].name).toEqual(file.name);
  });
});
describe("SingIn form inputs and reactions test", () => {
  it("Render must be processed", () => {
    //Testing folders names
    act(() => {
      render(<SignInPage />, container);
    });
    expect(container?.textContent?.length).toBeGreaterThan(0);
  });

  it("Should allow entering a username", () => {
    const signInPage = mount(<SignInPage></SignInPage>);

    const signInPageUsername = signInPage.findWhere(
      (node) =>
        node.is(TextField) && node.prop("data-testid") === "singin#username"
    );

    signInPageUsername.props().value = "testname";
    signInPageUsername.simulate("change");

    expect(signInPageUsername.props().value).toEqual("testname");
  });

  it("Should allow entering a password", () => {
    const signInPage = mount(<SignInPage></SignInPage>);
    const signInPagePassword = signInPage.findWhere(
      (node) =>
        node.is(TextField) && node.prop("data-testid") === "singin#password"
    );

    signInPagePassword.props().value = "testpassword";
    signInPagePassword.simulate("change");

    expect(signInPagePassword.props().value).toEqual("testpassword");
  });

  it("Should recognize submit", () => {
    const onSubmit = jest.fn();
    const signInPage = mount(
      <SignInPage SubmitCallback={onSubmit}></SignInPage>
    );

    const signInPageSubmit = signInPage.findWhere(
      (node) => node.is(Button) && node.prop("data-testid") === "singin#submit"
    );
    for (let i = 0; i < 10; i++) {
      signInPageSubmit.simulate("click");
    }
    expect(onSubmit).toHaveBeenCalledTimes(10);
  });
});
describe("FolderManagment form inputs and reactions test", () => {
  it("Render must be processed", () => {
    //Testing folders names
    act(() => {
      render(<SignInPage />, container);
    });
    expect(container?.textContent?.length).toBeGreaterThan(0);
  });

  it("Should allow entering a folder name", () => {
    const folderManagmentPage = mount(
      <FolderManagmentForm></FolderManagmentForm>
    );

    const folderManagmentName = folderManagmentPage.findWhere(
      (node) =>
        node.is(TextField) && node.prop("data-testid") === "folder#foldername"
    );

    folderManagmentName.props().value = "testname";
    folderManagmentName.simulate("change");

    expect(folderManagmentName.props().value).toEqual("testname");
  });

  it("Should recognize submit", () => {
    const onClick = jest.fn();
    const folderManagmentPage = mount(
      <FolderManagmentForm handlefolderClick={onClick}></FolderManagmentForm>
    );

    const folderManagmentSubmit = folderManagmentPage.findWhere(
      (node) => node.is(Button) && node.prop("data-testid") === "folder#submit"
    );
    for (let i = 0; i < 10; i++) {
      folderManagmentSubmit.simulate("click");
    }
    expect(onClick).toHaveBeenCalledTimes(10);
  });
});