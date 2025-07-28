import React, {
  type ChangeEventHandler,
  type FormEventHandler,
  type MouseEventHandler,
} from 'react';
import { createFileRoute } from '@tanstack/react-router';

// TODO: Make env its own package that pre-validates required env vars using schema validation
const { VITE_API_BASE_URL } = import.meta.env;

export const Route = createFileRoute('/candidates/create')({
  component: () => <CreateCandidateForm />,
});

type State = {
  resumeFile?: File;
  errors: {
    name?: string;
    expectedSalary?: string;
    resume?: string;
    general?: string;
  };
};

// TODO: Add unit tests for this component to simulate all use cases and make sure there are no gaps
class CreateCandidateForm extends React.Component<unknown, State> {
  private formRef = React.createRef<HTMLFormElement>();
  private fileInputRef = React.createRef<HTMLInputElement>();
  constructor(props: unknown) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      resumeFile: undefined,
      errors: {},
    };
  }

  handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type !== 'application/pdf') {
      this.setState({
        errors: { ...this.state.errors, resume: 'Only PDF files are allowed' },
      });
    } else if (!this.state.resumeFile) {
      this.setState({
        resumeFile: file,
        errors: { ...this.state.errors, resume: undefined },
      });
    }
  };

  handleFileClean: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    if (this.fileInputRef.current) {
      this.fileInputRef.current.value = '';
    }
    this.setState((prevState) => ({
      ...prevState,
      resumeFile: undefined,
    }));
  };

  handleButtonClick = () => {
    this.fileInputRef.current?.click();
  };

  handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const form = this.formRef.current;
    if (!form) {
      return;
    }
    const formData = new FormData(form);
    const name = formData.get('name');
    const expectedSalary = formData.get('expectedSalary') as string | null;
    if (!expectedSalary) {
      formData.delete('expectedSalary');
    }
    const resumeFile = formData.get('resume') as File | null;

    const errors: State['errors'] = {};
    if (!name) errors.name = 'Name is required';
    if (
      expectedSalary &&
      (!/^\d+$/.test(expectedSalary) || !(Number(expectedSalary) > 0))
    )
      errors.expectedSalary = 'Enter a valid expected salary (integer number)';
    if (!resumeFile || resumeFile.size <= 0) errors.resume = 'Resume is required';
    if (!resumeFile || Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }

    const response = await fetch(`${VITE_API_BASE_URL}/candidates/create`, {
      method: 'POST',
      body: formData,
    });
    if (response.status === 201) {
      // TODO: this is not using SPA features because of using Class components, please
      // consider rotating to Functional components and hooks so we can leverage Router Link
      // TODO: Improve success state. Consider using Toasts or similar
      window.location.href = '/candidates';
    }
    this.setState({
      errors: {
        general: 'Something went wrong. Please try again.',
      },
    });
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="mx-auto min-h-screen max-w-xl bg-white p-6 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <h2 className="mb-4 text-2xl font-bold">Create Candidate</h2>

        <form ref={this.formRef} onSubmit={this.handleSubmit} className="space-y-6">
          <div>
            <label className="mb-1 block cursor-pointer font-medium" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-800"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label
              className="mb-1 block cursor-pointer font-medium"
              htmlFor="expectedSalary"
            >
              Expected salary per hour
            </label>
            <input
              type="number"
              name="expectedSalary"
              id="expectedSalary"
              className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-800"
            />
            {errors.expectedSalary && (
              <p className="mt-1 text-sm text-red-500">{errors.expectedSalary}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block cursor-pointer font-medium" htmlFor="resume">
              Resume (PDF)
            </label>
            <input
              ref={this.fileInputRef}
              type="file"
              name="resume"
              id="resume"
              accept="application/pdf"
              onChange={this.handleFileChange}
              className="hidden"
            />
            {this.state.resumeFile ? (
              <div className="flex items-center gap-4" onClick={this.handleButtonClick}>
                <span className="h-fit">{this.state.resumeFile.name}</span>
                <button
                  onClick={this.handleFileClean}
                  className="cursor-pointer rounded bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-700"
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={this.handleButtonClick}
                className="cursor-pointer rounded bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-700"
              >
                Upload PDF
              </button>
            )}
            {errors.resume && (
              <p className="mt-1 text-sm text-red-500">{errors.resume}</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-primary hover:bg-primary-dark cursor-pointer rounded px-4 py-2 text-white"
          >
            Create Candidate
          </button>
          {errors.resume && (
            <p className="mt-1 text-sm text-red-500">{errors.general}</p>
          )}
        </form>
      </div>
    );
  }
}
