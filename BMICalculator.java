import java.util.Scanner;

public class BMICalculator {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        System.out.print("Enter your weight (kg): ");
        int weight = input.nextInt();

        System.out.print("Enter your height (cm): ");
        int height = input.nextInt();

        double bmi = weight / Math.pow(height / 100.0, 2);
        System.out.printf("Your BMI is: %.2f\n", bmi);

        if (bmi >= 20 && bmi <= 25) {
            System.out.println("Your BMI is considered normal.");
        } else {
            System.out.println("Your BMI is outside the normal range.");
        }
        
        input.close();
    }
}
