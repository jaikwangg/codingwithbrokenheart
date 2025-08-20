import javax.swing.*;
import java.awt.*;
import java.util.Scanner;

public class RealisticClockDots extends JPanel {
    private final int hour;   // 0–12
    private final int minute; // 0–59

    public RealisticClockDots(int hour, int minute) {
        this.hour = hour;
        this.minute = minute;
        setPreferredSize(new Dimension(420, 420));
    }

    @Override
    protected void paintComponent(Graphics g0) {
        super.paintComponent(g0);

        Graphics2D g = (Graphics2D) g0;
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        int cx = getWidth() / 2;
        int cy = getHeight() / 2;
        int radius = Math.min(cx, cy) - 20;

        // Outer circle (clock face)
        g.drawOval(cx - radius, cy - radius, radius * 2, radius * 2);

        // 12 dots at 5‑minute intervals
        int dotR = 5;
        int dotRing = radius - 12;      // how far the dots sit from center
        for (int i = 0; i < 12; i++) {
            double a = Math.toRadians(i * 30);      // 360/12
            int x = (int) Math.round(cx + dotRing * Math.cos(a - Math.PI / 2.0));
            int y = (int) Math.round(cy + dotRing * Math.sin(a - Math.PI / 2.0));
            g.fillOval(x - dotR, y - dotR, dotR * 2, dotR * 2);
        }

        // Hands
        drawHands(g, cx, cy, radius);
    }

    private void drawHands(Graphics2D g, int cx, int cy, int radius) {
        // Minute hand
        double minDeg = 90.0 - minute * 6.0;                 // 6° per minute
        double minRad = Math.toRadians(minDeg);
        int mLen = radius - 25;                               // longer
        int mx = (int) Math.round(cx + mLen * Math.cos(minRad));
        int my = (int) Math.round(cy - mLen * Math.sin(minRad));
        g.drawLine(cx, cy, mx, my);

        // Hour hand (with minute offset)
        double hourDeg = 90.0 - (hour % 12) * 30.0 - minute * 0.5;  // 30° per hour + 0.5° per minute
        double hourRad = Math.toRadians(hourDeg);
        int hLen = radius - 60;
        int hx = (int) Math.round(cx + hLen * Math.cos(hourRad));
        int hy = (int) Math.round(cy - hLen * Math.sin(hourRad));
        g.drawLine(cx, cy, hx, hy);
    }

    public static void main(String[] args) {
        // ===== Console input like Exercise 22 =====
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter hour (0 - 12): ");
        int hour = sc.nextInt();
        System.out.print("Enter minute (0 - 59): ");
        int minute = sc.nextInt();

        if (hour < 0 || hour > 12 || minute < 0 || minute > 59) {
            System.out.println("Error: hour must be 0 - 12 and minute 0 - 59.");
            System.exit(1);
        }

        JFrame f = new JFrame("Exercise 28 - Realistic Clock");
        f.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        f.add(new RealisticClockDots(hour, minute));
        f.pack();
        f.setLocationRelativeTo(null);
        f.setVisible(true);

        sc.close();
    }
}
