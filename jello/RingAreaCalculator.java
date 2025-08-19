import java.util.Scanner;

public class RingAreaCalculator {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Enter inner radius (ri): ");
        double ri = scanner.nextDouble();

        System.out.print("Enter outer radius (ro): ");
        double ro = scanner.nextDouble();

        double area = Math.PI * (ro * ro - ri * ri);
        System.out.printf("Shaded area is: %.2f\n", area);

        scanner.close();
    }
}
