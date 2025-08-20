import java.util.Scanner;

public class PerfectNumberChecker {
    
    // Method to get proper divisors
    public static void printDivisors(int n) {
        System.out.print("Proper divisors of " + n + " are: ");
        for (int i = 1; i <= n / 2; i++) {
            if (n % i == 0) {
                System.out.print(i + " ");
            }
        }
        System.out.println();
    }

    // Method to check if number is perfect
    public static boolean isPerfect(int n) {
        int sum = 0;
        for (int i = 1; i <= n / 2; i++) {
            if (n % i == 0) {
                sum += i;
            }
        }
        return sum == n;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        // Input
        System.out.print("Enter a positive integer: ");
        int number = sc.nextInt();

        // Print divisors
        printDivisors(number);

        // Check perfect number
        if (isPerfect(number)) {
            System.out.println(number + " is a PERFECT number.");
        } else {
            System.out.println(number + " is NOT a perfect number.");
        }

        System.out.println("\nTesting number between 20 and 30: 28");
        printDivisors(28);
        System.out.println("28 is perfect? " + isPerfect(28));

        System.out.println("\nTesting number between 490 and 500: 494");
        printDivisors(494);
        System.out.println("494 is perfect? " + isPerfect(494));

        System.out.println("\nTesting number between 490 and 500: 496");
        printDivisors(496);
        System.out.println("496 is perfect? " + isPerfect(496));

        sc.close();
    }
}
