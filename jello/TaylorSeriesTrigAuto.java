import java.util.Scanner;

public class TaylorSeriesTrigAuto {

    // Reduce x to [-pi, pi]
    private static double reduce(double x) {
        final double TWO_PI = 2.0 * Math.PI;
        x = x % TWO_PI;
        if (x > Math.PI)  x -= TWO_PI;
        if (x < -Math.PI) x += TWO_PI;
        return x;
    }

    // Compute sin(x) until terms are very small
    public static double sinTaylor(double x) {
        x = reduce(x);
        double term = x;   // first term
        double sum  = term;
        int n = 1;

        while (Math.abs(term) > 1e-15) { 
            term *= -x * x / ((2.0 * n) * (2.0 * n + 1.0));
            sum  += term;
            n++;
        }
        return sum;
    }

    public static double cosTaylor(double x) {
        x = reduce(x);
        double term = 1.0; // first term
        double sum  = term;
        int n = 1;

        while (Math.abs(term) > 1e-15) {
            term *= -x * x / ((2.0 * n - 1.0) * (2.0 * n));
            sum  += term;
            n++;
        }
        return sum;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter x (in radians): ");
        double x = sc.nextDouble();

        double s = sinTaylor(x);
        double c = cosTaylor(x);

        System.out.println("\nUsing Taylor series:");
        System.out.println("sin(" + x + ") ≈ " + s);
        System.out.println("cos(" + x + ") ≈ " + c);

        System.out.println("\nUsing Math class:");
        System.out.println("sin(" + x + ") = " + Math.sin(x));
        System.out.println("cos(" + x + ") = " + Math.cos(x));

        sc.close();
    }
}
