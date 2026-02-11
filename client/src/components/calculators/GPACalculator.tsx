import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, GraduationCap } from "lucide-react";

type Course = {
    id: number;
    name: string;
    grade: string;
    credits: number;
};

const GRADE_POINTS: Record<string, number> = {
    "A+": 4.0, "A": 4.0, "A-": 3.7,
    "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7,
    "D+": 1.3, "D": 1.0, "D-": 0.7,
    "F": 0.0
};

export function GPACalculator() {
    const [courses, setCourses] = useState<Course[]>([
        { id: 1, name: "Math", grade: "A", credits: 3 },
        { id: 2, name: "History", grade: "B", credits: 3 },
        { id: 3, name: "Science", grade: "A-", credits: 4 },
    ]);

    const addCourse = () => {
        setCourses([...courses, { id: Date.now(), name: `Course ${courses.length + 1}`, grade: "A", credits: 3 }]);
    };

    const removeCourse = (id: number) => {
        setCourses(courses.filter(c => c.id !== id));
    };

    const updateCourse = (id: number, field: keyof Course, value: string | number) => {
        setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const calculateGPA = () => {
        let totalPoints = 0;
        let totalCredits = 0;

        courses.forEach(course => {
            totalPoints += (GRADE_POINTS[course.grade] || 0) * course.credits;
            totalCredits += course.credits;
        });

        return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>GPA Calculator</CardTitle>
                <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold text-2xl">
                    GPA: {calculateGPA()}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {courses.map((course) => (
                    <div key={course.id} className="flex gap-2 items-center">
                        <Input
                            placeholder="Course Name"
                            value={course.name}
                            onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                            className="flex-grow"
                        />
                        <Select value={course.grade} onValueChange={(val) => updateCourse(course.id, "grade", val)}>
                            <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {Object.keys(GRADE_POINTS).map(g => (
                                    <SelectItem key={g} value={g}>{g}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input
                            type="number"
                            placeholder="Credits"
                            value={course.credits}
                            onChange={(e) => updateCourse(course.id, "credits", parseFloat(e.target.value) || 0)}
                            className="w-[80px]"
                        />
                        <Button variant="ghost" size="icon" onClick={() => removeCourse(course.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                ))}

                <Button onClick={addCourse} variant="outline" className="w-full border-dashed">
                    <Plus className="h-4 w-4 mr-2" /> Add Course
                </Button>
            </CardContent>
        </Card>
    );
}
