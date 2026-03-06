using System;
using System.Web;
using System.Web.UI.WebControls;
using System.Data;
using System.Data.SqlClient;
using System.Web.UI;

public partial class Forms_ICIA_SERV_00 : System.Web.UI.Page
{    
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            txtpase.Text = Servicio.Numeropase(HttpContext.Current.User.Identity.Name);
            txtusuario.Text = Servicio.NombreUsuario(HttpContext.Current.User.Identity.Name);
            txtfechaingserv.Text = DateTime.Now.ToString("dd/MM/yyyy") + " 08:00:00";
            txtfechasalserv.Text = DateTime.Now.AddDays(1).ToString("dd/MM/yyyy") + " 08:00:00";
            CboEmergencia();
        }
    }
    private void CboEmergencia()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.connectionstring);
        SqlConn.Open();
        string sql = "SELECT Users.Usuario AS Pase, RTRIM(Grados.Descripcion) + ' ' + RTRIM(Users.NombreApp) AS Usuario FROM Users INNER JOIN Grados ON Users.Gr_Id = Grados.Gr_Id INNER JOIN Grupos ON Users.Grp_Id = Grupos.Grp_Id INNER JOIN Distritales ON Grupos.Dis_Id = Distritales.Dis_Id WHERE (Distritales.Uni_Id = 22)";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        ddlemergencia.ClearSelection();
        ddlemergencia.Items.Clear();
        ddlemergencia.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            ddlemergencia.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }
    protected void ddlemergencia_SelectedIndexChanged(object sender, EventArgs e)
    {
        txtpaseemer.Text = ddlemergencia.SelectedValue.ToString();
    }
    protected void btncreacionservicio_Click(object sender, EventArgs e)
    {
        Page.Validate("GuardaServicio");
        if (Page.IsValid)
        {
            DateTime fechaing = Convert.ToDateTime(txtfechaingserv.Text.Trim());
            DateTime fechasal = Convert.ToDateTime(txtfechasalserv.Text.Trim());
            if (Servicio.VerificarNroCaso(txtfechaingserv.Text.Trim(), txtpase.Text.Trim()) == "NO")
            {
                txtnroserv.Text = "ICIA-" + fechaing.ToString("dd") + fechasal.ToString("dd") + DateTime.Now.ToString("MM") + DateTime.Now.ToString("yyyy");
                btnguardar.Visible = true;
            }
            else
            {
                btnguardar.Visible = false;
                Response.Redirect("~/Forms/ICIA-SERV-00.aspx");
            }
        }
    }    
    protected void btnguardar_Click(object sender, EventArgs e)
    {
        ScriptManager.RegisterStartupScript(this, this.GetType(), Guid.NewGuid().ToString(), "showAlert();", true);
        Servicio.Insertservicio(txtnroserv.Text.Trim(), txtpase.Text.Trim(), txtpaseemer.Text.Trim(), txtfechaingserv.Text.Trim(), txtfechasalserv.Text.Trim());
        Response.Redirect("~/Forms/ICIA-SERV-00.aspx");
    }    
}