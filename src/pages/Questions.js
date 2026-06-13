import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { bulkCreateQuestionsApi } from "../api/questionApi";
import { getTestByIdApi, updateTestApi } from "../api/testApi";
import ErrorAlert from "../components/ErrorAlert";
import PageLoader from "../components/PageLoader";
import TestSummaryCard from "../components/TestSummaryCard";
import { DIFFICULTIES } from "../constants/options";
import { useTestFlow } from "../context/TestContext";
import { getApiErrorMessage, unwrapData } from "../utils/api";

const schema = yup.object({
  question: yup.string().required("Question text is required"),
  option1: yup.string().required("Option 1 is required"),
  option2: yup.string().required("Option 2 is required"),
  option3: yup.string().required("Option 3 is required"),
  option4: yup.string().required("Option 4 is required"),
  correct_option: yup.string().required("Correct option is required"),
});
const defaults = {
  type: "mcq",
  question: "",
  option1: "",
  option2: "",
  option3: "",
  option4: "",
  correct_option: "option1",
  explanation: "",
  difficulty: "easy",
  topic: "",
  sub_topic: "",
  media_url: "",
};

export default function Questions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeTest, questions, dispatch } = useTestFlow();
  const [test, setTest] = useState(activeTest);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!activeTest);
  const [apiError, setApiError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema), defaultValues: defaults });

  useEffect(() => {
    if (activeTest) return;
    (async () => {
      setLoading(true);
      try {
        const data = unwrapData(await getTestByIdApi(id));
        setTest(data);
        dispatch({ type: "SET_TEST", payload: data });
      } catch (err) {
        setApiError(getApiErrorMessage(err, "Unable to load test"));
      } finally {
        setLoading(false);
      }
    })();
  }, [id, activeTest, dispatch]);

  const onAddQuestion = (values) => {
    const question = { ...values, test_id: id };
    if (selectedIndex !== null)
      dispatch({
        type: "UPDATE_QUESTION",
        payload: { index: selectedIndex, question },
      });
    else dispatch({ type: "ADD_QUESTION", payload: question });
    setSelectedIndex(null);
    reset(defaults);
  };
  const editQuestion = (index) => {
    setSelectedIndex(index);
    reset(questions[index]);
  };
  // const deleteQuestion = (index) => {
  //   dispatch({ type: "DELETE_QUESTION", payload: index });
  //   if (selectedIndex === index) {
  //     setSelectedIndex(null);
  //     reset(defaults);
  //   }
  // };
  const saveAndContinue = async () => {
    if (!questions.length) {
      setApiError("Add at least one question before continuing.");
      return;
    }
    setSaving(true);
    setApiError("");
    try {
      const response = await bulkCreateQuestionsApi(
        questions.map((q) => ({ ...q, test_id: id }))
      );
      const created = unwrapData(response) || [];
      const questionIds = created.map((q) => q.id).filter(Boolean);
      if (questionIds.length)
        await updateTestApi(id, {
          questions: questionIds,
          total_questions: questionIds.length,
        });
      navigate(`/tests/${id}/preview`);
    } catch (err) {
      setApiError(getApiErrorMessage(err, "Unable to save questions"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader label="Loading question workspace..." />;
  return (
    <div className="question-workspace page-fade">
      <aside className="question-sidebar">
        <p>Question creation</p>
        <span>Total Questions . {test?.total_questions || 50}</span>
        {questions.map((_, index) => (
          <button
            key={index}
            className="question-nav-item"
            onClick={() => editQuestion(index)}
          >
            <i className="bi bi-check-circle-fill" /> Question {index + 1}
            <i className="bi bi-chevron-right" />
          </button>
        ))}
      </aside>
      <section className="question-main">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <p className="breadcrumb-text mb-0">
            Test Creation / Create Test / Chapter Wise
          </p>
          <button
            className="btn btn-primary"
            onClick={saveAndContinue}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save & Continue"}
          </button>
        </div>
        <TestSummaryCard
          test={test}
          onEdit={() => navigate(`/tests/${id}/edit`)}
        />
        <div className="d-flex justify-content-between align-items-center mt-4">
          <h6>
            Question{" "}
            {selectedIndex !== null ? selectedIndex + 1 : questions.length + 1}/
            {test?.total_questions || 50}
          </h6>
          <div>
            <button className="btn btn-light btn-sm me-2" type="button">
              + MCQ
            </button>
            <button className="btn btn-light btn-sm" type="button">
              <i className="bi bi-download" /> CSV
            </button>
          </div>
        </div>
        <ErrorAlert message={apiError} />
        <form onSubmit={handleSubmit(onAddQuestion)} className="question-form">
          <label>Question Text</label>
          <div className="editor-toolbar">
            <i>B</i>
            <i>I</i>
            <i>U</i>
            <i>↻</i>
            <i>•</i>
            <i>≡</i>
            <i>⌘</i>
          </div>
          <textarea
            className="form-control rich-box"
            placeholder="Type here"
            {...register("question")}
          />
          <small className="text-danger">{errors.question?.message}</small>
          <label className="mt-3">Type the options below</label>
          {["option1", "option2", "option3", "option4"].map((name, index) => (
            <div className="option-row" key={name}>
              <input
                type="radio"
                value={name}
                {...register("correct_option")}
              />
              <input
                className="form-control"
                placeholder="Type Option here"
                {...register(name)}
              />
              <i className="bi bi-trash" />
            </div>
          ))}
          <small className="text-danger">
            {errors.option1?.message ||
              errors.option2?.message ||
              errors.option3?.message ||
              errors.option4?.message}
          </small>
          <label className="mt-3">Add Solution</label>
          <textarea
            className="form-control solution-box"
            placeholder="Type here"
            {...register("explanation")}
          />
          <div className="question-settings">
            <p>Question settings</p>
            <label>Level of Difficulty</label>
            <select className="form-select" {...register("difficulty")}>
              {DIFFICULTIES.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
            <label>Topic</label>
            <input
              className="form-control"
              placeholder="Optional topic id/name"
              {...register("topic")}
            />
            <label>Sub-topic</label>
            <input
              className="form-control"
              placeholder="Optional sub-topic id/name"
              {...register("sub_topic")}
            />
          </div>
          <div className="form-actions">
            <button
              className="btn btn-danger"
              type="button"
              onClick={() => navigate("/dashboard")}
            >
              Exit Test Creation
            </button>
            <button className="btn btn-outline-primary" type="submit">
              {selectedIndex !== null
                ? "Update Question"
                : "Add Another Question"}
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={saveAndContinue}
            >
              Next
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
