package test;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class RegistrationTest {

    public static void main(String[] args) throws Exception {

        System.setProperty("webdriver.chrome.driver","G:/chromedriver/chromedriver.exe");

        WebDriver driver = new ChromeDriver();

        driver.get("file:///C:/Users/asus/OneDrive%20-%20Lovely%20Professional%20University/Desktop/uni/RegistrationSystem/index.html");

        driver.manage().window().maximize();

        // Negative case
        driver.findElement(By.id("fname")).sendKeys("Aarti");
        driver.findElement(By.id("email")).sendKeys("test@gmail.com");
        driver.findElement(By.id("phone")).sendKeys("9876543210");
        driver.findElement(By.id("pass")).sendKeys("123456");
        driver.findElement(By.id("cpass")).sendKeys("123456");

        driver.findElements(By.name("gender")).get(0).click();
        driver.findElement(By.id("terms")).click();

        Thread.sleep(2000);
        driver.findElement(By.id("btn")).click();

        Thread.sleep(2000);
        driver.navigate().refresh();

        // Positive case
        driver.findElement(By.id("fname")).sendKeys("Aarti");
        driver.findElement(By.id("lname")).sendKeys("Kashyap");
        driver.findElement(By.id("email")).sendKeys("test@gmail.com");
        driver.findElement(By.id("phone")).sendKeys("9876543210");
        driver.findElement(By.id("pass")).sendKeys("123456");
        driver.findElement(By.id("cpass")).sendKeys("123456");

        driver.findElements(By.name("gender")).get(1).click();
        driver.findElement(By.id("terms")).click();

        Thread.sleep(2000);
        driver.findElement(By.id("btn")).click();

        Thread.sleep(3000);
//        driver.quit();
    }
}
