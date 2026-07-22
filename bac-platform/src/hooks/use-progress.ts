"use client";

import { useState, useEffect, useMemo } from "react";
import { SCIENTIFIC_STREAM_PROGRESS_DATA, LessonStatus, ProgressSubject } from "@/data/bac-progress-data";

export function useProgress() {
  const [progressState, setProgressState] = useState<Record<string, LessonStatus>>({});
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("bac_user_progress_map");
      if (stored) {
        setProgressState(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load progress from localStorage", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const updateLessonStatus = (lessonId: string, nextStatus: LessonStatus) => {
    const updated = { ...progressState, [lessonId]: nextStatus };
    setProgressState(updated);
    try {
      window.localStorage.setItem("bac_user_progress_map", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save progress to localStorage", e);
    }
  };

  // Helper calculations
  const stats = useMemo(() => {
    let totalCompletedLessons = 0;
    let totalLessonsCount = 0;

    let totalWeightedPoints = 0;
    let totalCoefficients = 0;

    const subjectsCalculations = SCIENTIFIC_STREAM_PROGRESS_DATA.map((subject: ProgressSubject) => {
      const subjectTotal = subject.lessons.length;
      totalLessonsCount += subjectTotal;

      const completedInSubject = subject.lessons.filter(
        (l) => progressState[l.id] === "COMPLETED"
      ).length;

      const inProgressInSubject = subject.lessons.filter(
        (l) => progressState[l.id] === "IN_PROGRESS"
      ).length;

      totalCompletedLessons += completedInSubject;

      const subjectPercentage = subjectTotal > 0 ? Math.round((completedInSubject / subjectTotal) * 100) : 0;

      // BAC Weighted Readiness
      totalWeightedPoints += subjectPercentage * subject.coefficient;
      totalCoefficients += subject.coefficient;

      return {
        ...subject,
        completedCount: completedInSubject,
        inProgressCount: inProgressInSubject,
        totalCount: subjectTotal,
        percentage: subjectPercentage,
      };
    });

    const overallFlatPercentage = totalLessonsCount > 0 ? Math.round((totalCompletedLessons / totalLessonsCount) * 100) : 0;
    const bacReadinessIndex = totalCoefficients > 0 ? Math.round(totalWeightedPoints / totalCoefficients) : 0;

    return {
      subjects: subjectsCalculations,
      totalCompletedLessons,
      totalLessonsCount,
      overallFlatPercentage,
      bacReadinessIndex,
    };
  }, [progressState]);

  return {
    isHydrated,
    progressState,
    updateLessonStatus,
    ...stats,
  };
}
