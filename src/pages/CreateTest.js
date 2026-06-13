import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import {
  getSubjectsApi,
  getSubTopicsByMultiTopicsApi,
  getTopicsBySubjectApi,
} from "../api/masterApi";
import { createTestApi, getTestByIdApi, updateTestApi } from "../api/testApi";
import ErrorAlert from "../components/ErrorAlert";
import PageLoader from "../components/PageLoader";
import { DIFFICULTIES, TEST_TYPES } from "../constants/options";
import { useTestFlow } from "../context/TestContext";
import { getApiErrorMessage, unwrapData } from "../utils/api";
import { getCached } from "../utils/cache";

const schema = yup.object({
  name: yup.string().required("Test name is required"),
  subject: yup.string().required("Subject is required"),
  topics: yup.array().min(1, "Select at least one topic"),
  sub_topics: yup.array().min(1, "Select at least one sub topic"),
  total_time: yup.number().typeError("Duration is required").positive("Enter valid duration").required(),
  difficulty: yup.string().required("Difficulty is required"),
  wrong_marks: yup.number().typeError("Wrong marks required").required(),
  unattempt_marks: yup.number().typeError("Unattempted marks required").required(),
  correct_marks: yup.number().typeError("Correct marks required").required(),
  total_questions: yup.number().typeError("No of questions required").positive().required(),
  total_marks: yup.number().typeError("Total marks required").positive().required(),
});

const defaults = {
  type: "chapterwise",
  name: "",
  subject: "",
  topics: [],
  sub_topics: [],
  total_time: "",
  difficulty: "easy",
  wrong_marks: -1,
  unattempt_marks: 0,
  correct_marks: 5,
  total_questions: "",
  total_marks: "",
};

export default function CreateTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useTestFlow();

  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subTopics, setSubTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(Boolean(id));
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema), defaultValues: defaults });

  const selectedSubject = watch("subject");
  const selectedTopics = watch("topics") || [];
  const selectedType = watch("type");

  const selectedTopicsKey = useMemo(
    () => selectedTopics.join(","),
    [selectedTopics]
  );

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        setSubjects(unwrapData(await getCached("subjects", getSubjectsApi)) || []);
      } catch (err) {
        setApiError(getApiErrorMessage(err, "Unable to load subjects"));
      }
    };

    loadSubjects();
  }, []);

  useEffect(() => {
    if (!selectedSubject) return;

    const loadTopics = async () => {
      setValue("topics", []);
      setValue("sub_topics", []);
      setSubTopics([]);

      try {
        setTopics(
          unwrapData(
            await getCached(`topics-${selectedSubject}`, () =>
              getTopicsBySubjectApi(selectedSubject)
            )
          ) || []
        );
      } catch (err) {
        setApiError(getApiErrorMessage(err, "Unable to load topics"));
      }
    };

    loadTopics();
  }, [selectedSubject, setValue]);

  useEffect(() => {
    if (!selectedTopics.length) {
      setSubTopics([]);
      return;
    }

    const loadSubTopics = async () => {
      setValue("sub_topics", []);

      try {
        setSubTopics(
          unwrapData(
            await getCached(`subtopics-${selectedTopicsKey}`, () =>
              getSubTopicsByMultiTopicsApi(selectedTopics)
            )
          ) || []
        );
      } catch (err) {
        setApiError(getApiErrorMessage(err, "Unable to load sub topics"));
      }
    };

    loadSubTopics();
  }, [selectedTopics, selectedTopicsKey, setValue]);

  const loadTest = useCallback(async () => {
    if (!id) return;

    setPageLoading(true);

    try {
      const test = unwrapData(await getTestByIdApi(id));

      reset({
        ...defaults,
        ...test,
        subject: test?.subject?.id || test?.subject || "",
        topics: test?.topics || [],
        sub_topics: test?.sub_topics || [],
      });

      dispatch({ type: "SET_TEST", payload: test });
    } catch (err) {
      setApiError(getApiErrorMessage(err, "Unable to load test"));
    } finally {
      setPageLoading(false);
    }
  }, [id, reset, dispatch]);

  useEffect(() => {
    loadTest();
  }, [loadTest]);

  const onSubmit = async (values) => {
    setLoading(true);
    setApiError("");

    const payload = {
      ...values,
      total_time: Number(values.total_time),
      total_questions: Number(values.total_questions),
      total_marks: Number(values.total_marks),
      correct_marks: Number(values.correct_marks),
      wrong_marks: Number(values.wrong_marks),
      unattempt_marks: Number(values.unattempt_marks),
      status: "draft",
    };

    try {
      const response = id
        ? await updateTestApi(id, payload)
        : await createTestApi(payload);

      const test = unwrapData(response);

      dispatch({ type: "SET_TEST", payload: test });
      navigate(`/tests/${test?.id || id}/questions`);
    } catch (err) {
      setApiError(getApiErrorMessage(err, "Unable to save test"));
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <PageLoader label="Loading test..." />;

  return (
    <div className="page-fade create-page">
      <p className="breadcrumb-text">Test Creation / Create Test / Chapter Wise</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="tabs-card">
          {TEST_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              className={selectedType === type.value ? "active" : ""}
              onClick={() => setValue("type", type.value)}
            >
              {type.label}
            </button>
          ))}
        </div>

        <ErrorAlert message={apiError} />

        <div className="form-grid two-col">
          <div>
            <label>Subject</label>
            <select className="form-select" {...register("subject")}>
              <option value="">Choose from Drop-down</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <small className="text-danger">{errors.subject?.message}</small>
          </div>

          <div>
            <label>Name of Test</label>
            <input
              className="form-control"
              placeholder="Enter name of Test"
              {...register("name")}
            />
            <small className="text-danger">{errors.name?.message}</small>
          </div>

          <div>
            <label>Topic</label>
            <select
              multiple
              className="form-select multi-select"
              {...register("topics")}
              disabled={!topics.length}
            >
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <small className="text-danger">{errors.topics?.message}</small>
          </div>

          <div>
            <label>Sub Topic</label>
            <select
              multiple
              className="form-select multi-select"
              {...register("sub_topics")}
              disabled={!subTopics.length}
            >
              {subTopics.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <small className="text-danger">{errors.sub_topics?.message}</small>
          </div>

          <div>
            <label>Duration (Minutes)</label>
            <input
              className="form-control"
              placeholder="Enter the time"
              {...register("total_time")}
            />
            <small className="text-danger">{errors.total_time?.message}</small>
          </div>

          <div>
            <label>Test Difficulty Level</label>
            <div className="radio-row">
              {DIFFICULTIES.map((d) => (
                <label key={d.value}>
                  <input type="radio" value={d.value} {...register("difficulty")} />{" "}
                  {d.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <h6 className="mt-4 mb-3">Marking Scheme:</h6>

        <div className="form-grid five-col">
          <div>
            <label>Wrong Answer</label>
            <input className="form-control" type="number" {...register("wrong_marks")} />
          </div>

          <div>
            <label>Unattempted</label>
            <input className="form-control" type="number" {...register("unattempt_marks")} />
          </div>

          <div>
            <label>Correct Answer</label>
            <input className="form-control" type="number" {...register("correct_marks")} />
          </div>

          <div>
            <label>No of Questions</label>
            <input
              className="form-control"
              placeholder="Ex:50"
              type="number"
              {...register("total_questions")}
            />
          </div>

          <div>
            <label>Total Marks</label>
            <input
              className="form-control"
              placeholder="Ex:250 Marks"
              type="number"
              {...register("total_marks")}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-light" onClick={() => navigate("/dashboard")}>
            Cancel
          </button>

          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
}